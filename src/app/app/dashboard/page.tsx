import Link from "next/link";
import { format } from "date-fns";
import { eq, desc, count } from "drizzle-orm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Layers,
    CalendarDays,
    Sparkles,
    Brain,
    ArrowRight,
} from "lucide-react";
import { db } from "@/lib/db";
import {
    eras,
    events,
    artifacts,
    identitySnapshots,
    personalityEntries,
    culturalInfluences,
} from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";
import { GuidedPrompts } from "@/components/summary/guided-prompts";

const PROMPTS = [
    "What's a belief you held five years ago that you've since let go of?",
    "What's the most recent moment that reminded you of who you used to be?",
    "If your current era had a soundtrack, what would be on it?",
    "What's something you're quietly proud of that nobody knows about?",
    "What pattern keeps showing up in your life?",
    "What would your younger self think of you right now?",
    "What's the hardest lesson this era has taught you so far?",
    "Who's shaped you the most in the last year, and how?",
    "What's a small moment that turned out to be a turning point?",
    "What are you becoming that you didn't expect?",
    "What's one thing you'd tell your future self?",
    "What's the most underrated era of your life so far?",
    "If you wrote a letter to yourself from five years ago, what would you say?",
    "What environment has shaped you the most?",
    "What's something you used to love that you've outgrown?",
    "What would the title of your memoir be right now?",
    "What's a decision you almost didn't make that changed everything?",
    "What cultural moment (song, show, game) defined a chapter of your life?",
    "What's the bravest thing you've done?",
    "What's the next era you want to create for yourself?",
];

function getDailyPrompt(): string {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        86400000
    );
    return PROMPTS[dayOfYear % PROMPTS.length];
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const [
        eraList,
        eventList,
        [eventCountResult],
        [artifactCountResult],
        [influenceCountResult],
        latestIdentity,
        personalityList,
    ] = await Promise.all([
        db
            .select()
            .from(eras)
            .where(eq(eras.userId, user.id))
            .orderBy(eras.sortOrder, desc(eras.createdAt)),
        db
            .select()
            .from(events)
            .where(eq(events.userId, user.id))
            .orderBy(desc(events.date), desc(events.createdAt))
            .limit(5),
        db
            .select({ value: count() })
            .from(events)
            .where(eq(events.userId, user.id)),
        db
            .select({ value: count() })
            .from(artifacts)
            .where(eq(artifacts.userId, user.id)),
        db
            .select({ value: count() })
            .from(culturalInfluences)
            .where(eq(culturalInfluences.userId, user.id)),
        db
            .select()
            .from(identitySnapshots)
            .where(eq(identitySnapshots.userId, user.id))
            .orderBy(desc(identitySnapshots.capturedAt))
            .limit(1)
            .then((rows) => rows[0] ?? null),
        db
            .select()
            .from(personalityEntries)
            .where(eq(personalityEntries.userId, user.id)),
    ]);

    const displayName = user.user_metadata?.display_name ?? "there";
    const currentEra = eraList.find((e) => !e.endDate) ?? eraList[0];
    const eventCount = eventCountResult?.value ?? 0;
    const artifactCount = artifactCountResult?.value ?? 0;
    const influenceCount = influenceCountResult?.value ?? 0;
    const prompt = getDailyPrompt();

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Hey, {displayName}.
                </h1>
                <p className="text-muted-foreground">
                    Your life at a glance.
                </p>
            </div>
            <Separator />

            {/* Prompt of the day */}
            <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                    <CardDescription className="flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" />
                        Prompt of the day
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm font-medium italic">
                        &ldquo;{prompt}&rdquo;
                    </p>
                </CardContent>
            </Card>

            {/* AI reflection prompts */}
            <GuidedPrompts />

            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Eras</CardDescription>
                        <CardTitle className="text-3xl">
                            {eraList.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            {currentEra
                                ? `Current: ${currentEra.name}`
                                : "No eras defined yet"}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Events</CardDescription>
                        <CardTitle className="text-3xl">{eventCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Key moments recorded
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Artifacts</CardDescription>
                        <CardTitle className="text-3xl">
                            {artifactCount}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Photos, links & files
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Influences</CardDescription>
                        <CardTitle className="text-3xl">
                            {influenceCount}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Culture that shaped you
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Quick add</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            render={<Link href="/app/eras/new" />}
                        >
                            <Layers className="mr-1 h-3.5 w-3.5" />
                            Era
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            render={<Link href="/app/events/new" />}
                        >
                            <CalendarDays className="mr-1 h-3.5 w-3.5" />
                            Event
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Current identity snapshot */}
            {latestIdentity && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardDescription className="flex items-center gap-1.5">
                                <Brain className="h-3.5 w-3.5" />
                                Current Identity
                            </CardDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            render={<Link href="/app/identity" />}
                        >
                            Edit <ArrowRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                                    Who I Was
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {(
                                        (latestIdentity.pastSelf as string[]) ??
                                        []
                                    ).map((t) => (
                                        <Badge
                                            key={t}
                                            variant="secondary"
                                            className="text-[10px]"
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                    {((latestIdentity.pastSelf as string[]) ??
                                        []).length === 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                                    Who I Am
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {(
                                        (latestIdentity.currentSelf as string[]) ??
                                        []
                                    ).map((t) => (
                                        <Badge
                                            key={t}
                                            variant="outline"
                                            className="text-[10px]"
                                        >
                                            {t}
                                        </Badge>
                                    ))}
                                    {((latestIdentity.currentSelf as string[]) ??
                                        []).length === 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                </div>
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                                    Who I&apos;m Becoming
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {(
                                        (latestIdentity.futureSelf as string[]) ??
                                        []
                                    ).map((t) => (
                                        <Badge className="text-[10px]">
                                            {t}
                                        </Badge>
                                    ))}
                                    {((latestIdentity.futureSelf as string[]) ??
                                        []).length === 0 && (
                                            <span className="text-xs text-muted-foreground">
                                                —
                                            </span>
                                        )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent events */}
            <div>
                <div className="flex items-center justify-between pb-3">
                    <h2 className="text-lg font-semibold">Recent events</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href="/app/events" />}
                    >
                        View all
                    </Button>
                </div>
                {eventList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            No events yet. Start by adding the moments that
                            shaped your life.
                        </p>
                        <Button
                            className="mt-4"
                            render={<Link href="/app/events/new" />}
                        >
                            <Plus />
                            Add your first event
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {eventList.map((event) => (
                            <Link
                                key={event.id}
                                href={`/app/events/${event.id}`}
                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {event.title}
                                        </p>
                                        {event.date && (
                                            <p className="text-xs text-muted-foreground">
                                                {format(
                                                    new Date(event.date),
                                                    "MMM d, yyyy"
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {event.tags &&
                                    (event.tags as string[]).length > 0 && (
                                        <div className="flex gap-1">
                                            {(event.tags as string[])
                                                .slice(0, 2)
                                                .map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                        </div>
                                    )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Eras */}
            <div>
                <div className="flex items-center justify-between pb-3">
                    <h2 className="text-lg font-semibold">Your eras</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        render={<Link href="/app/eras" />}
                    >
                        View all
                    </Button>
                </div>
                {eraList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            No eras yet. Name the chapters of your life.
                        </p>
                        <Button
                            className="mt-4"
                            render={<Link href="/app/eras/new" />}
                        >
                            <Plus />
                            Create your first era
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {eraList.map((era) => (
                            <Link
                                key={era.id}
                                href={`/app/eras/${era.id}`}
                                className="rounded-lg border p-3 transition-colors hover:bg-muted/50"
                            >
                                <p className="text-sm font-medium">
                                    {era.name}
                                </p>
                                {era.startDate && (
                                    <p className="text-xs text-muted-foreground">
                                        {format(
                                            new Date(era.startDate),
                                            "yyyy"
                                        )}
                                        {" — "}
                                        {era.endDate
                                            ? format(
                                                new Date(era.endDate),
                                                "yyyy"
                                            )
                                            : "Present"}
                                    </p>
                                )}
                                {era.summary && (
                                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                        {era.summary}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
