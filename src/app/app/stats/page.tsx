import { Separator } from "@/components/ui/separator";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Layers,
    CalendarDays,
    Image,
    Sparkles,
    Brain,
    Clock,
    Tag,
    BarChart3,
    Trophy,
} from "lucide-react";
import { getLifeStats } from "@/app/app/stats/actions";

const LAYER_LABELS: Record<string, string> = {
    life_event: "Life Events",
    identity: "Identity",
    interest: "Interests",
    emotion: "Emotions",
    environment: "Environment",
};

const CATEGORY_LABELS: Record<string, string> = {
    song: "Songs",
    show: "Shows",
    game: "Games",
    book: "Books",
    place: "Places",
    internet: "Internet",
    trend: "Trends",
    family: "Family",
    community: "Community",
    subculture: "Subculture",
};

const TYPE_LABELS: Record<string, string> = {
    photo: "Photos",
    video: "Videos",
    audio: "Audio",
    document: "Documents",
    screenshot: "Screenshots",
    text: "Text",
    link: "Links",
    playlist: "Playlists",
};

export default async function StatsPage() {
    const stats = await getLifeStats();

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Life Stats
                </h1>
                <p className="text-muted-foreground">Your life in numbers.</p>
            </div>
            <Separator />

            {/* Overview counters */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" />
                            Eras
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.totalEras}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />
                            Events
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.totalEvents}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Image className="h-3.5 w-3.5" />
                            Artifacts
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.totalArtifacts}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            Influences
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.totalInfluences}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Brain className="h-3.5 w-3.5" />
                            Identity Versions
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.totalIdentityVersions}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <BarChart3 className="h-3.5 w-3.5" />
                            Personality
                        </CardDescription>
                        <CardTitle className="text-3xl">
                            {stats.personalityDimensions}
                            <span className="text-sm font-normal text-muted-foreground">
                                /7
                            </span>
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Time & era highlights */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            Timeline Span
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.timeSpanYears != null ? (
                            <div>
                                <p className="text-2xl font-bold">
                                    {stats.timeSpanYears} years
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {stats.earliestEvent} → {stats.latestEvent}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Add dated events to see your span
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Layers className="h-3.5 w-3.5" />
                            Current Era
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.currentEra ? (
                            <p className="text-lg font-semibold">
                                {stats.currentEra}
                            </p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                No active era
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="flex items-center gap-1.5">
                            <Trophy className="h-3.5 w-3.5" />
                            Longest Era
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {stats.longestEra ? (
                            <div>
                                <p className="text-lg font-semibold">
                                    {stats.longestEra.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(stats.longestEra.days / 365.25 * 10) / 10} years
                                    ({stats.longestEra.days.toLocaleString()} days)
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Add era dates to compute
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Breakdowns */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Events by layer */}
                {Object.keys(stats.eventsByLayer).length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Events by Layer</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(stats.eventsByLayer)
                                .sort(([, a], [, b]) => b - a)
                                .map(([layer, ct]) => (
                                    <div
                                        key={layer}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {LAYER_LABELS[layer] ?? layer}
                                        </span>
                                        <Badge variant="secondary">{ct}</Badge>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                )}

                {/* Events by era */}
                {stats.eventsByEra.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Events by Era</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stats.eventsByEra.map((e) => (
                                <div
                                    key={e.name}
                                    className="flex items-center justify-between"
                                >
                                    <span className="truncate text-sm">
                                        {e.name}
                                    </span>
                                    <Badge variant="secondary">{e.count}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Top tags */}
                {stats.topTags.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription className="flex items-center gap-1.5">
                                <Tag className="h-3.5 w-3.5" />
                                Top Tags
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {stats.topTags.map((t) => (
                                <div
                                    key={t.tag}
                                    className="flex items-center justify-between"
                                >
                                    <span className="text-sm">{t.tag}</span>
                                    <Badge variant="secondary">{t.count}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {/* Influences by category */}
                {Object.keys(stats.influencesByCategory).length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>
                                Influences by Category
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(stats.influencesByCategory)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, ct]) => (
                                    <div
                                        key={cat}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {CATEGORY_LABELS[cat] ?? cat}
                                        </span>
                                        <Badge variant="secondary">{ct}</Badge>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                )}

                {/* Artifacts by type */}
                {Object.keys(stats.artifactsByType).length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Artifacts by Type</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {Object.entries(stats.artifactsByType)
                                .sort(([, a], [, b]) => b - a)
                                .map(([type, ct]) => (
                                    <div
                                        key={type}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm">
                                            {TYPE_LABELS[type] ?? type}
                                        </span>
                                        <Badge variant="secondary">{ct}</Badge>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
