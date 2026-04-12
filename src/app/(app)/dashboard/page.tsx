import Link from "next/link";
import { format } from "date-fns";
import { eq, desc } from "drizzle-orm";
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
import { Plus, Layers, CalendarDays } from "lucide-react";
import { db } from "@/lib/db";
import { eras, events } from "@/lib/db/schema";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const [eraList, eventList] = await Promise.all([
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
    ]);

    const displayName = user.user_metadata?.display_name ?? "there";
    const currentEra = eraList.find((e) => !e.endDate) ?? eraList[0];

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

            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Eras</CardDescription>
                        <CardTitle className="text-3xl">{eraList.length}</CardTitle>
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
                        <CardTitle className="text-3xl">{eventList.length > 4 ? "5+" : eventList.length}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-muted-foreground">
                            Key moments recorded
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription>Quick add</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Button size="sm" variant="outline" render={<Link href="/app/eras/new" />}>
                            <Layers className="mr-1 h-3.5 w-3.5" />
                            Era
                        </Button>
                        <Button size="sm" variant="outline" render={<Link href="/app/events/new" />}>
                            <CalendarDays className="mr-1 h-3.5 w-3.5" />
                            Event
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Recent events */}
            <div>
                <div className="flex items-center justify-between pb-3">
                    <h2 className="text-lg font-semibold">Recent events</h2>
                    <Button variant="ghost" size="sm" render={<Link href="/app/events" />}>
                        View all
                    </Button>
                </div>
                {eventList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            No events yet. Start by adding the moments that shaped your life.
                        </p>
                        <Button className="mt-4" render={<Link href="/app/events/new" />}>
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
                                        <p className="text-sm font-medium">{event.title}</p>
                                        {event.date && (
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(event.date), "MMM d, yyyy")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {event.tags && (event.tags as string[]).length > 0 && (
                                    <div className="flex gap-1">
                                        {(event.tags as string[]).slice(0, 2).map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
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
                    <Button variant="ghost" size="sm" render={<Link href="/app/eras" />}>
                        View all
                    </Button>
                </div>
                {eraList.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <p className="text-muted-foreground">
                            No eras yet. Name the chapters of your life.
                        </p>
                        <Button className="mt-4" render={<Link href="/app/eras/new" />}>
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
                                <p className="text-sm font-medium">{era.name}</p>
                                {era.startDate && (
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(era.startDate), "yyyy")}
                                        {" — "}
                                        {era.endDate
                                            ? format(new Date(era.endDate), "yyyy")
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
