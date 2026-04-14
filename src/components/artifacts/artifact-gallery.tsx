"use client";

import { useState } from "react";
import { ArtifactCard } from "./artifact-card";
import { ArtifactForm } from "./artifact-form";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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

type EraOption = { id: string; name: string };
type EventOption = { id: string; title: string };

const TYPE_FILTERS = [
    { value: "", label: "All" },
    { value: "photo", label: "Photos" },
    { value: "video", label: "Videos" },
    { value: "audio", label: "Audio" },
    { value: "document", label: "Documents" },
    { value: "screenshot", label: "Screenshots" },
    { value: "link", label: "Links" },
    { value: "playlist", label: "Playlists" },
    { value: "text", label: "Text" },
];

export function ArtifactGallery({
    artifacts,
    eras,
    events,
}: {
    artifacts: ArtifactWithRelations[];
    eras: EraOption[];
    events: EventOption[];
}) {
    const [showForm, setShowForm] = useState(false);
    const [typeFilter, setTypeFilter] = useState("");
    const [eraFilter, setEraFilter] = useState("");

    const filtered = artifacts.filter((a) => {
        if (typeFilter && a.artifact.type !== typeFilter) return false;
        if (eraFilter && a.artifact.eraId !== eraFilter) return false;
        return true;
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                <Button
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? (
                        <>
                            <X className="mr-1 h-4 w-4" /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="mr-1 h-4 w-4" /> Add Artifact
                        </>
                    )}
                </Button>

                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs"
                >
                    {TYPE_FILTERS.map((f) => (
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

                <span className="ml-auto text-xs text-muted-foreground">
                    {filtered.length} artifact{filtered.length !== 1 && "s"}
                </span>
            </div>

            {/* Add form */}
            {showForm && (
                <div className="rounded-lg border bg-card p-4">
                    <ArtifactForm
                        eras={eras}
                        events={events}
                        onDone={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Gallery grid */}
            {filtered.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed">
                    <p className="text-muted-foreground">
                        {artifacts.length === 0
                            ? "No artifacts yet. Add your first one above."
                            : "No artifacts match the current filters."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filtered.map((a) => (
                        <ArtifactCard key={a.artifact.id} data={a} />
                    ))}
                </div>
            )}
        </div>
    );
}
