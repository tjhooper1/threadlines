"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
    format,
    parseISO,
    startOfMonth,
    endOfMonth,
    eachMonthOfInterval,
} from "date-fns";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Pencil } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

type EventData = {
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

type EraData = {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    summary: string | null;
    definingTraits: string[] | null;
    lessonLearned: string | null;
};

type ZoomLevel = "decade" | "year" | "month";
type LayerType =
    | "life_event"
    | "identity"
    | "interest"
    | "emotion"
    | "environment";

// ── Constants ──────────────────────────────────────────────────────────────

const ALL_LAYERS: LayerType[] = [
    "life_event",
    "identity",
    "interest",
    "emotion",
    "environment",
];

const LAYER_CONFIG: Record<
    LayerType,
    { label: string; color: string; bg: string; dot: string }
> = {
    life_event: {
        label: "Life Event",
        color: "text-blue-700 dark:text-blue-300",
        bg: "bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-800",
        dot: "bg-blue-500",
    },
    identity: {
        label: "Identity",
        color: "text-purple-700 dark:text-purple-300",
        bg: "bg-purple-50 border-purple-200 dark:bg-purple-950/50 dark:border-purple-800",
        dot: "bg-purple-500",
    },
    interest: {
        label: "Interest",
        color: "text-green-700 dark:text-green-300",
        bg: "bg-green-50 border-green-200 dark:bg-green-950/50 dark:border-green-800",
        dot: "bg-green-500",
    },
    emotion: {
        label: "Emotion",
        color: "text-amber-700 dark:text-amber-300",
        bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-800",
        dot: "bg-amber-500",
    },
    environment: {
        label: "Environment",
        color: "text-teal-700 dark:text-teal-300",
        bg: "bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:border-teal-800",
        dot: "bg-teal-500",
    },
};

const ERA_COLORS = [
    "bg-rose-100/60 border-rose-300 dark:bg-rose-900/30 dark:border-rose-700",
    "bg-sky-100/60 border-sky-300 dark:bg-sky-900/30 dark:border-sky-700",
    "bg-violet-100/60 border-violet-300 dark:bg-violet-900/30 dark:border-violet-700",
    "bg-orange-100/60 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700",
    "bg-emerald-100/60 border-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700",
];

const COLUMN_WIDTH: Record<ZoomLevel, number> = {
    decade: 300,
    year: 180,
    month: 140,
};

// ── Helpers ────────────────────────────────────────────────────────────────

function formatEventDate(dateStr: string | null, precision: string | null) {
    if (!dateStr) return null;
    const d = parseISO(dateStr);
    switch (precision) {
        case "year":
            return format(d, "yyyy");
        case "month":
            return format(d, "MMM yyyy");
        default:
            return format(d, "MMM d, yyyy");
    }
}

function parseDateSafe(dateStr: string | null): Date | null {
    if (!dateStr) return null;
    try {
        return parseISO(dateStr);
    } catch {
        return null;
    }
}

// ── Component ──────────────────────────────────────────────────────────────

export function TimelineShell({
    events,
    eras,
}: {
    events: EventData[];
    eras: EraData[];
}) {
    const [zoom, setZoom] = useState<ZoomLevel>("year");
    const [activeLayers, setActiveLayers] = useState<Set<LayerType>>(
        new Set(ALL_LAYERS),
    );
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [filterEraId, setFilterEraId] = useState<string>("all");
    const scrollRef = useRef<HTMLDivElement>(null);

    // Filter events: must have a date + match active layers + match era filter
    const filteredEvents = useMemo(() => {
        return events.filter((e) => {
            if (!e.event.date) return false;
            if (
                !activeLayers.has((e.event.layer || "life_event") as LayerType)
            )
                return false;
            if (filterEraId !== "all" && e.event.eraId !== filterEraId)
                return false;
            return true;
        });
    }, [events, activeLayers, filterEraId]);

    // Calculate time columns based on zoom level and date range
    const { columns, dateToColumn } = useMemo(() => {
        const allDates: Date[] = [];
        for (const e of events) {
            const d = parseDateSafe(e.event.date);
            if (d) allDates.push(d);
        }
        for (const era of eras) {
            const s = parseDateSafe(era.startDate);
            const end = parseDateSafe(era.endDate);
            if (s) allDates.push(s);
            if (end) allDates.push(end);
        }

        if (allDates.length === 0) {
            return { columns: [] as { label: string; start: Date; end: Date }[], dateToColumn: () => -1 };
        }

        allDates.sort((a, b) => a.getTime() - b.getTime());
        const minDate = allDates[0];
        const maxDate = allDates[allDates.length - 1];

        const cols: { label: string; start: Date; end: Date }[] = [];

        if (zoom === "decade") {
            const startDecade = Math.floor(minDate.getFullYear() / 10) * 10;
            const endDecade =
                Math.floor(maxDate.getFullYear() / 10) * 10 + 10;
            for (let y = startDecade; y <= endDecade; y += 10) {
                cols.push({
                    label: `${y}s`,
                    start: new Date(y, 0, 1),
                    end: new Date(y + 9, 11, 31),
                });
            }
        } else if (zoom === "year") {
            const startYear = minDate.getFullYear();
            const endYear = maxDate.getFullYear();
            for (let y = startYear; y <= endYear; y++) {
                cols.push({
                    label: `${y}`,
                    start: new Date(y, 0, 1),
                    end: new Date(y, 11, 31),
                });
            }
        } else {
            const months = eachMonthOfInterval({
                start: startOfMonth(minDate),
                end: endOfMonth(maxDate),
            });
            for (const m of months) {
                cols.push({
                    label: format(m, "MMM yyyy"),
                    start: startOfMonth(m),
                    end: endOfMonth(m),
                });
            }
        }

        const dateToCol = (date: Date): number => {
            for (let i = 0; i < cols.length; i++) {
                if (date >= cols[i].start && date <= cols[i].end) return i;
            }
            if (date < cols[0].start) return 0;
            return cols.length - 1;
        };

        return { columns: cols, dateToColumn: dateToCol };
    }, [events, eras, zoom]);

    const colWidth = COLUMN_WIDTH[zoom];
    const totalWidth = columns.length * colWidth;

    // Group filtered events by column
    const eventsByColumn = useMemo(() => {
        const map = new Map<number, EventData[]>();
        for (const e of filteredEvents) {
            const d = parseDateSafe(e.event.date);
            if (!d) continue;
            const col = dateToColumn(d);
            if (!map.has(col)) map.set(col, []);
            map.get(col)!.push(e);
        }
        return map;
    }, [filteredEvents, dateToColumn]);

    // Calculate era bar positions
    const eraPositions = useMemo(() => {
        if (columns.length === 0) return [];
        return eras
            .filter((era) => era.startDate)
            .map((era, index) => {
                const start = parseDateSafe(era.startDate);
                const end = parseDateSafe(era.endDate) || new Date();
                if (!start) return null;
                const startCol = dateToColumn(start);
                const endCol = dateToColumn(end);
                return {
                    era,
                    startCol,
                    endCol,
                    colorClass: ERA_COLORS[index % ERA_COLORS.length],
                };
            })
            .filter(
                (p): p is NonNullable<typeof p> => p !== null,
            );
    }, [eras, columns.length, dateToColumn]);

    const toggleLayer = useCallback((layer: LayerType) => {
        setActiveLayers((prev) => {
            const next = new Set(prev);
            if (next.has(layer)) {
                next.delete(layer);
            } else {
                next.add(layer);
            }
            return next;
        });
    }, []);

    // Scroll to the right (most recent) on mount
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, []);

    const undatedCount = events.filter((e) => !e.event.date).length;

    // ── Empty states ───────────────────────────────────────────────────────

    if (events.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-12">
                <div className="text-center">
                    <p className="text-muted-foreground">No events yet.</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add some events to see your timeline.
                    </p>
                </div>
            </div>
        );
    }

    if (columns.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-12">
                <div className="text-center">
                    <p className="text-muted-foreground">
                        No dated events to display.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add dates to your events to see them on the timeline.
                    </p>
                </div>
            </div>
        );
    }

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-1 flex-col gap-4">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Zoom */}
                <div className="flex items-center gap-0.5 rounded-lg border bg-muted/50 p-0.5">
                    {(["decade", "year", "month"] as ZoomLevel[]).map(
                        (level) => (
                            <Button
                                key={level}
                                variant={zoom === level ? "default" : "ghost"}
                                size="xs"
                                onClick={() => setZoom(level)}
                            >
                                {level.charAt(0).toUpperCase() + level.slice(1)}
                            </Button>
                        ),
                    )}
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Layer toggles */}
                <div className="flex flex-wrap items-center gap-1">
                    {ALL_LAYERS.map((layer) => {
                        const config = LAYER_CONFIG[layer];
                        const active = activeLayers.has(layer);
                        return (
                            <button
                                key={layer}
                                onClick={() => toggleLayer(layer)}
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all ${active
                                    ? `${config.bg} ${config.color}`
                                    : "border-transparent bg-muted/50 text-muted-foreground opacity-50"
                                    }`}
                            >
                                <span
                                    className={`size-2 rounded-full ${active ? config.dot : "bg-muted-foreground/50"}`}
                                />
                                {config.label}
                            </button>
                        );
                    })}
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Era filter */}
                <select
                    value={filterEraId}
                    onChange={(e) => setFilterEraId(e.target.value)}
                    className="h-7 rounded-md border bg-background px-2 text-xs"
                >
                    <option value="all">All Eras</option>
                    {eras.map((era) => (
                        <option key={era.id} value={era.id}>
                            {era.name}
                        </option>
                    ))}
                </select>

                {undatedCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                        {undatedCount} undated event
                        {undatedCount > 1 ? "s" : ""} hidden
                    </span>
                )}
            </div>

            {/* Timeline */}
            <div
                ref={scrollRef}
                className="relative isolate flex-1 overflow-x-auto rounded-lg border bg-background"
            >
                <div style={{ minWidth: totalWidth }} className="relative">
                    {/* Column headers */}
                    <div className="sticky top-0 z-10 flex border-b bg-muted/30 backdrop-blur-sm">
                        {columns.map((col, i) => (
                            <div
                                key={i}
                                className="shrink-0 border-r px-2 py-2 text-center text-xs font-medium text-muted-foreground last:border-r-0"
                                style={{ width: colWidth }}
                            >
                                {col.label}
                            </div>
                        ))}
                    </div>

                    {/* Event area */}
                    <div className="flex" style={{ minHeight: 200 }}>
                        {columns.map((_col, colIndex) => {
                            const colEvents =
                                eventsByColumn.get(colIndex) || [];
                            return (
                                <div
                                    key={colIndex}
                                    className="shrink-0 border-r p-1.5 last:border-r-0"
                                    style={{ width: colWidth }}
                                >
                                    <div className="flex flex-col gap-1">
                                        {colEvents.map((e) => {
                                            const layer = (e.event.layer ||
                                                "life_event") as LayerType;
                                            const config = LAYER_CONFIG[layer];
                                            return (
                                                <button
                                                    key={e.event.id}
                                                    onClick={() =>
                                                        setSelectedEvent(e)
                                                    }
                                                    className={`w-full rounded border px-2 py-1.5 text-left text-xs transition-all hover:shadow-sm ${config.bg} ${config.color}`}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className={`size-1.5 shrink-0 rounded-full ${config.dot}`}
                                                        />
                                                        <span className="truncate font-medium">
                                                            {e.event.title}
                                                        </span>
                                                    </div>
                                                    {e.event.date && (
                                                        <p className="mt-0.5 truncate text-[10px] opacity-70">
                                                            {formatEventDate(
                                                                e.event.date,
                                                                e.event
                                                                    .datePrecision,
                                                            )}
                                                        </p>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Era bars */}
                    {eraPositions.length > 0 && (
                        <div
                            className="relative border-t"
                            style={{
                                height: eraPositions.length * 32 + 8,
                            }}
                        >
                            {eraPositions.map(
                                ({ era, startCol, endCol, colorClass }, i) => (
                                    <div
                                        key={era.id}
                                        className={`absolute flex h-6 items-center rounded-md border pl-2 ${colorClass}`}
                                        style={{
                                            left: startCol * colWidth + 4,
                                            width:
                                                (endCol - startCol + 1) *
                                                colWidth -
                                                8,
                                            top: i * 32 + 4,
                                        }}
                                    >
                                        <span className="truncate text-[10px] font-medium text-foreground/70">
                                            {era.name}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Event detail sheet */}
            <Sheet
                open={!!selectedEvent}
                onOpenChange={(open) => {
                    if (!open) setSelectedEvent(null);
                }}
            >
                <SheetContent side="right" className="overflow-y-auto">
                    {selectedEvent && (
                        <>
                            <SheetHeader>
                                <div className="flex items-center gap-2">
                                    <SheetTitle>
                                        {selectedEvent.event.title}
                                    </SheetTitle>
                                    {selectedEvent.event.layer && (
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${LAYER_CONFIG[
                                                (selectedEvent.event
                                                    .layer as LayerType) ||
                                                "life_event"
                                            ].bg
                                                } ${LAYER_CONFIG[
                                                    (selectedEvent.event
                                                        .layer as LayerType) ||
                                                    "life_event"
                                                ].color
                                                }`}
                                        >
                                            {
                                                LAYER_CONFIG[
                                                    (selectedEvent.event
                                                        .layer as LayerType) ||
                                                    "life_event"
                                                ].label
                                            }
                                        </span>
                                    )}
                                </div>
                                <SheetDescription>
                                    {formatEventDate(
                                        selectedEvent.event.date,
                                        selectedEvent.event.datePrecision,
                                    )}
                                    {selectedEvent.eraName && (
                                        <>
                                            {selectedEvent.event.date &&
                                                " · "}
                                            {selectedEvent.eraName}
                                        </>
                                    )}
                                </SheetDescription>
                            </SheetHeader>

                            <Separator className="my-4" />

                            <div className="space-y-4 px-4 pb-4">
                                {selectedEvent.event.description && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            Description
                                        </p>
                                        <p className="text-sm">
                                            {selectedEvent.event.description}
                                        </p>
                                    </div>
                                )}
                                {selectedEvent.event.impact && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            Impact
                                        </p>
                                        <p className="text-sm">
                                            {selectedEvent.event.impact}
                                        </p>
                                    </div>
                                )}
                                {selectedEvent.event.beliefCreated && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            Belief Created
                                        </p>
                                        <p className="text-sm italic">
                                            &ldquo;
                                            {
                                                selectedEvent.event
                                                    .beliefCreated
                                            }
                                            &rdquo;
                                        </p>
                                    </div>
                                )}
                                {selectedEvent.event.downstreamEffects && (
                                    <div>
                                        <p className="mb-1 text-xs font-medium text-muted-foreground">
                                            Downstream Effects
                                        </p>
                                        <p className="text-sm">
                                            {
                                                selectedEvent.event
                                                    .downstreamEffects
                                            }
                                        </p>
                                    </div>
                                )}
                                {selectedEvent.event.tags &&
                                    selectedEvent.event.tags.length > 0 && (
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-muted-foreground">
                                                Tags
                                            </p>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedEvent.event.tags.map(
                                                    (tag) => (
                                                        <Badge
                                                            key={tag}
                                                            variant="secondary"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                <Separator />

                                <Button
                                    variant="outline"
                                    size="sm"
                                    render={
                                        <Link
                                            href={`/app/events/${selectedEvent.event.id}`}
                                        />
                                    }
                                >
                                    <Pencil />
                                    Edit Event
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
