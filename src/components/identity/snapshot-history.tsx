"use client";

import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SnapshotData = {
    id: string;
    pastSelf: string[] | null;
    currentSelf: string[] | null;
    futureSelf: string[] | null;
    notes: string | null;
    capturedAt: Date;
};

export function SnapshotHistory({
    snapshots,
}: {
    snapshots: SnapshotData[];
}) {
    if (snapshots.length <= 1) return null;

    // Show all except the latest (which is being edited)
    const history = snapshots.slice(1);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
                Previous Versions ({history.length})
            </h3>
            <div className="space-y-3">
                {history.map((snap) => (
                    <Card key={snap.id} className="bg-muted/30">
                        <CardHeader className="pb-2">
                            <CardDescription>
                                {format(
                                    new Date(snap.capturedAt),
                                    "MMM d, yyyy 'at' h:mm a",
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <CardTitle className="mb-1 text-xs text-amber-600 dark:text-amber-400">
                                        Was
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-1">
                                        {(snap.pastSelf ?? []).map((t) => (
                                            <Badge
                                                key={t}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {t}
                                            </Badge>
                                        ))}
                                        {(!snap.pastSelf ||
                                            snap.pastSelf.length === 0) && (
                                                <span className="text-xs text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div>
                                    <CardTitle className="mb-1 text-xs text-blue-600 dark:text-blue-400">
                                        Am
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-1">
                                        {(snap.currentSelf ?? []).map((t) => (
                                            <Badge
                                                key={t}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {t}
                                            </Badge>
                                        ))}
                                        {(!snap.currentSelf ||
                                            snap.currentSelf.length === 0) && (
                                                <span className="text-xs text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                    </div>
                                </div>
                                <div>
                                    <CardTitle className="mb-1 text-xs text-emerald-600 dark:text-emerald-400">
                                        Becoming
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-1">
                                        {(snap.futureSelf ?? []).map((t) => (
                                            <Badge
                                                key={t}
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {t}
                                            </Badge>
                                        ))}
                                        {(!snap.futureSelf ||
                                            snap.futureSelf.length === 0) && (
                                                <span className="text-xs text-muted-foreground">
                                                    —
                                                </span>
                                            )}
                                    </div>
                                </div>
                            </div>
                            {snap.notes && (
                                <p className="mt-2 text-xs italic text-muted-foreground">
                                    {snap.notes}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
