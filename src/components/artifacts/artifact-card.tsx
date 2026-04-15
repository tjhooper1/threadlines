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
    Image,
    Video,
    Music,
    FileText,
    Monitor,
    Type,
    Link as LinkIcon,
    ListMusic,
    ExternalLink,
} from "lucide-react";
import { deleteArtifact } from "@/app/app/artifacts/actions";

type ArtifactWithRelations = {
    artifact: {
        id: string;
        type: string;
        url: string;
        caption: string | null;
        date: string | null;
        eventId: string | null;
        eraId: string | null;
    };
    eraName: string | null;
    eventTitle: string | null;
};

const TYPE_CONFIG: Record<
    string,
    { label: string; icon: React.ElementType; color: string }
> = {
    photo: {
        label: "Photo",
        icon: Image,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    video: {
        label: "Video",
        icon: Video,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    audio: {
        label: "Audio",
        icon: Music,
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    },
    document: {
        label: "Document",
        icon: FileText,
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
    screenshot: {
        label: "Screenshot",
        icon: Monitor,
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    },
    text: {
        label: "Text",
        icon: Type,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    },
    link: {
        label: "Link",
        icon: LinkIcon,
        color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    },
    playlist: {
        label: "Playlist",
        icon: ListMusic,
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
};

function isImageUrl(url: string) {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?|$)/i.test(url);
}

export function ArtifactCard({ data }: { data: ArtifactWithRelations }) {
    const { artifact, eraName, eventTitle } = data;
    const config = TYPE_CONFIG[artifact.type] ?? {
        label: artifact.type,
        icon: FileText,
        color: "bg-muted text-muted-foreground",
    };
    const Icon = config.icon;
    const showPreview =
        (artifact.type === "photo" || artifact.type === "screenshot") &&
        isImageUrl(artifact.url);

    return (
        <Card className="group overflow-hidden">
            {showPreview && (
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={artifact.url}
                        alt={artifact.caption ?? "Artifact"}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                </div>
            )}
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                        >
                            <Icon className="h-3 w-3" />
                            {config.label}
                        </span>
                        {artifact.date && (
                            <CardDescription>{artifact.date}</CardDescription>
                        )}
                    </div>
                    {artifact.caption && (
                        <CardTitle className="text-sm leading-snug">
                            {artifact.caption}
                        </CardTitle>
                    )}
                </div>
                <form action={deleteArtifact}>
                    <input type="hidden" name="id" value={artifact.id} />
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
                <div className="flex flex-wrap gap-1">
                    {eraName && <Badge variant="secondary">{eraName}</Badge>}
                    {eventTitle && (
                        <Badge variant="outline">{eventTitle}</Badge>
                    )}
                </div>
                {!showPreview && (
                    <a
                        href={artifact.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                        <ExternalLink className="h-3 w-3" />
                        <span className="max-w-[200px] truncate">
                            {artifact.url}
                        </span>
                    </a>
                )}
            </CardContent>
        </Card>
    );
}
