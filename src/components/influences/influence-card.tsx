"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Trash2,
    Music,
    Tv,
    Gamepad2,
    BookOpen,
    MapPin,
    Globe,
    TrendingUp,
    Users,
    Heart,
    Sparkles,
} from "lucide-react";
import { deleteInfluence } from "@/app/app/influences/actions";

type InfluenceWithEra = {
    influence: {
        id: string;
        category: string;
        name: string;
        eraId: string | null;
        ageOrYear: string | null;
        whyItMattered: string | null;
        imageUrl: string | null;
    };
    eraName: string | null;
};

const CATEGORY_CONFIG: Record<
    string,
    { label: string; icon: React.ElementType; color: string; bg: string }
> = {
    song: {
        label: "Song",
        icon: Music,
        color: "text-pink-600 dark:text-pink-400",
        bg: "bg-pink-50 dark:bg-pink-950",
    },
    show: {
        label: "Show / Movie",
        icon: Tv,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950",
    },
    game: {
        label: "Game",
        icon: Gamepad2,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950",
    },
    book: {
        label: "Book",
        icon: BookOpen,
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950",
    },
    place: {
        label: "Place",
        icon: MapPin,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    internet: {
        label: "Internet",
        icon: Globe,
        color: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-50 dark:bg-cyan-950",
    },
    trend: {
        label: "Trend",
        icon: TrendingUp,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950",
    },
    family: {
        label: "Family",
        icon: Heart,
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950",
    },
    community: {
        label: "Community",
        icon: Users,
        color: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-950",
    },
    subculture: {
        label: "Subculture",
        icon: Sparkles,
        color: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-50 dark:bg-violet-950",
    },
};

export function InfluenceCard({ data }: { data: InfluenceWithEra }) {
    const { influence, eraName } = data;
    const config = CATEGORY_CONFIG[influence.category] ?? {
        label: influence.category,
        icon: Sparkles,
        color: "text-muted-foreground",
        bg: "bg-muted",
    };
    const Icon = config.icon;

    return (
        <Card className={`group overflow-hidden ${config.bg}`}>
            {influence.imageUrl && (
                <div className="relative aspect-square w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={influence.imageUrl}
                        alt={influence.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                </div>
            )}
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-1">
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <CardTitle className="truncate text-sm">
                            {influence.name}
                        </CardTitle>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                        <CardDescription className="text-xs">
                            {config.label}
                        </CardDescription>
                        {influence.ageOrYear && (
                            <CardDescription className="text-xs">
                                · {influence.ageOrYear}
                            </CardDescription>
                        )}
                    </div>
                </div>
                <form action={deleteInfluence}>
                    <input type="hidden" name="id" value={influence.id} />
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                        type="submit"
                    >
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </form>
            </CardHeader>
            <CardContent className="space-y-2 pb-3">
                {influence.whyItMattered && (
                    <p className="text-xs text-muted-foreground line-clamp-3">
                        {influence.whyItMattered}
                    </p>
                )}
                {eraName && (
                    <Badge variant="secondary" className="text-[10px]">
                        {eraName}
                    </Badge>
                )}
            </CardContent>
        </Card>
    );
}
