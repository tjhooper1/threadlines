"use client";

import { useState } from "react";
import { InfluenceCard } from "./influence-card";
import { InfluenceForm } from "./influence-form";
import { Button } from "@/components/ui/button";
import { Plus, X, LayoutGrid, List } from "lucide-react";

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

type EraOption = { id: string; name: string };

const CATEGORY_FILTERS = [
    { value: "", label: "All" },
    { value: "song", label: "Songs" },
    { value: "show", label: "Shows" },
    { value: "game", label: "Games" },
    { value: "book", label: "Books" },
    { value: "place", label: "Places" },
    { value: "internet", label: "Internet" },
    { value: "trend", label: "Trends" },
    { value: "family", label: "Family" },
    { value: "community", label: "Community" },
    { value: "subculture", label: "Subculture" },
];

export function InfluenceGrid({
    influences,
    eras,
}: {
    influences: InfluenceWithEra[];
    eras: EraOption[];
}) {
    const [showForm, setShowForm] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("");
    const [eraFilter, setEraFilter] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "mosaic">("grid");

    const filtered = influences.filter((i) => {
        if (categoryFilter && i.influence.category !== categoryFilter)
            return false;
        if (eraFilter && i.influence.eraId !== eraFilter) return false;
        return true;
    });

    // Group by category for mosaic view
    const grouped = filtered.reduce(
        (acc, item) => {
            const cat = item.influence.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        },
        {} as Record<string, InfluenceWithEra[]>
    );

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" onClick={() => setShowForm(!showForm)}>
                    {showForm ? (
                        <>
                            <X className="mr-1 h-4 w-4" /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="mr-1 h-4 w-4" /> Add Influence
                        </>
                    )}
                </Button>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                >
                    {CATEGORY_FILTERS.map((f) => (
                        <option key={f.value} value={f.value}>
                            {f.label}
                        </option>
                    ))}
                </select>

                <select
                    value={eraFilter}
                    onChange={(e) => setEraFilter(e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                >
                    <option value="">All Eras</option>
                    {eras.map((era) => (
                        <option key={era.id} value={era.id}>
                            {era.name}
                        </option>
                    ))}
                </select>

                <div className="ml-auto flex items-center gap-1">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("grid")}
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === "mosaic" ? "default" : "ghost"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setViewMode("mosaic")}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <span className="ml-2 text-xs text-muted-foreground">
                        {filtered.length} influence
                        {filtered.length !== 1 && "s"}
                    </span>
                </div>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="rounded-lg border bg-card p-4">
                    <InfluenceForm
                        eras={eras}
                        onDone={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Content */}
            {filtered.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                        {influences.length === 0
                            ? "No influences yet. Add songs, shows, games, and more that shaped you."
                            : "No influences match the current filters."}
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((i) => (
                        <InfluenceCard key={i.influence.id} data={i} />
                    ))}
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category}>
                            <h3 className="mb-3 text-sm font-semibold capitalize text-muted-foreground">
                                {category === "show"
                                    ? "Shows / Movies"
                                    : category + "s"}
                                <span className="ml-2 text-xs font-normal">
                                    ({items.length})
                                </span>
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {items.map((i) => (
                                    <InfluenceCard
                                        key={i.influence.id}
                                        data={i}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
