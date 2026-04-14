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
import { Trash2 } from "lucide-react";
import { deletePersonalityEntry } from "@/app/app/personality/actions";

type EntryWithEra = {
    entry: {
        id: string;
        eraId: string | null;
        dimension: string;
        value: string | null;
        notes: string | null;
    };
    eraName: string | null;
};

const DIMENSION_CONFIG: Record<
    string,
    { label: string; color: string }
> = {
    confidence: {
        label: "Confidence",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    introversion: {
        label: "Introversion",
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    values: {
        label: "Values",
        color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
    },
    triggers: {
        label: "Triggers",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    motivations: {
        label: "Motivations",
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    },
    strengths: {
        label: "Strengths",
        color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    },
    sabotage: {
        label: "Self-Sabotage",
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    },
};

export function PersonalityEntryCard({ data }: { data: EntryWithEra }) {
    const { entry, eraName } = data;
    const config = DIMENSION_CONFIG[entry.dimension] ?? {
        label: entry.dimension,
        color: "bg-muted text-muted-foreground",
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
                        >
                            {config.label}
                        </span>
                        {eraName && (
                            <CardDescription>{eraName}</CardDescription>
                        )}
                    </div>
                    <CardTitle className="text-base">
                        {entry.value}
                    </CardTitle>
                </div>
                <form action={deletePersonalityEntry}>
                    <input type="hidden" name="id" value={entry.id} />
                    <Button variant="ghost" size="icon-xs" type="submit">
                        <Trash2 className="text-destructive" />
                    </Button>
                </form>
            </CardHeader>
            {entry.notes && (
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {entry.notes}
                    </p>
                </CardContent>
            )}
        </Card>
    );
}
