"use client";

import { format } from "date-fns";
import { deleteEvent } from "@/app/app/events/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

type EventWithEra = {
    event: {
        id: string;
        title: string;
        date: string | null;
        datePrecision: "year" | "month" | "day" | null;
        description: string | null;
        impact: string | null;
        beliefCreated: string | null;
        downstreamEffects: string | null;
        tags: string[] | null;
        layer: string | null;
        eraId: string | null;
    };
    eraName: string | null;
};

const layerLabels: Record<string, string> = {
    life_event: "Life Event",
    identity: "Identity",
    interest: "Interest",
    emotion: "Emotion",
    environment: "Environment",
};

const layerColors: Record<string, string> = {
    life_event: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    identity: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    interest: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    emotion: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    environment: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
};

function formatEventDate(dateStr: string | null, precision: string | null) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    switch (precision) {
        case "year":
            return format(d, "yyyy");
        case "month":
            return format(d, "MMM yyyy");
        default:
            return format(d, "MMM d, yyyy");
    }
}

export function EventCard({ data }: { data: EventWithEra }) {
    const { event, eraName } = data;
    const dateDisplay = formatEventDate(event.date, event.datePrecision);

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        {event.layer && (
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${layerColors[event.layer] ?? ""}`}
                            >
                                {layerLabels[event.layer] ?? event.layer}
                            </span>
                        )}
                    </div>
                    <CardDescription>
                        {dateDisplay}
                        {eraName && (
                            <>
                                {dateDisplay && " · "}
                                {eraName}
                            </>
                        )}
                    </CardDescription>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" render={<Link href={`/app/events/${event.id}`} />}>
                        <Pencil className="h-5 w-5" />
                    </Button>
                    <form action={deleteEvent}>
                        <input type="hidden" name="id" value={event.id} />
                        <Button variant="ghost" size="icon-sm" type="submit">
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </form>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {event.description && (
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                )}
                {event.impact && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">Impact</p>
                        <p className="text-sm">{event.impact}</p>
                    </div>
                )}
                {event.beliefCreated && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            Belief created
                        </p>
                        <p className="text-sm italic">&ldquo;{event.beliefCreated}&rdquo;</p>
                    </div>
                )}
                {event.downstreamEffects && (
                    <div>
                        <p className="text-xs font-medium text-muted-foreground">
                            What it changed
                        </p>
                        <p className="text-sm">{event.downstreamEffects}</p>
                    </div>
                )}
                {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {event.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
