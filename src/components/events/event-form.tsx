"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEvent, updateEvent } from "@/app/(app)/events/actions";

type Era = { id: string; name: string };

type Event = {
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

const layerOptions = [
    { value: "life_event", label: "Life Event" },
    { value: "identity", label: "Identity" },
    { value: "interest", label: "Interest" },
    { value: "emotion", label: "Emotion" },
    { value: "environment", label: "Environment" },
];

const precisionOptions = [
    { value: "day", label: "Exact date" },
    { value: "month", label: "Month only" },
    { value: "year", label: "Year only" },
];

export function EventForm({
    event,
    eras,
    mode = "full",
    onCancel,
}: {
    event?: Event;
    eras: Era[];
    mode?: "quick" | "full";
    onCancel?: () => void;
}) {
    const [tags, setTags] = useState<string[]>(event?.tags ?? []);
    const [tagInput, setTagInput] = useState("");
    const [showFull, setShowFull] = useState(mode === "full");

    const addTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags([...tags, trimmed]);
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter((t) => t !== tag));
    };

    return (
        <form action={event ? updateEvent : createEvent} className="space-y-4">
            {event && <input type="hidden" name="id" value={event.id} />}
            <input type="hidden" name="tags" value={JSON.stringify(tags)} />

            <div className="space-y-2">
                <Label htmlFor="title">What happened? *</Label>
                <Input
                    id="title"
                    name="title"
                    placeholder={`"Parents divorced", "Moved to Austin", "First job"...`}
                    defaultValue={event?.title ?? ""}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">When</Label>
                    <Input
                        id="date"
                        name="date"
                        type="date"
                        defaultValue={event?.date ?? ""}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="datePrecision">Precision</Label>
                    <select
                        id="datePrecision"
                        name="datePrecision"
                        defaultValue={event?.datePrecision ?? "day"}
                        className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                    >
                        {precisionOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">What happened</Label>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what happened..."
                    defaultValue={event?.description ?? ""}
                    rows={3}
                />
            </div>

            {!showFull && (
                <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={() => setShowFull(true)}
                >
                    + Add deeper reflection
                </Button>
            )}

            {showFull && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor="impact">How it affected me</Label>
                        <Textarea
                            id="impact"
                            name="impact"
                            placeholder="What was the emotional or psychological impact?"
                            defaultValue={event?.impact ?? ""}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="beliefCreated">What belief it created</Label>
                        <Textarea
                            id="beliefCreated"
                            name="beliefCreated"
                            placeholder={`"I can only rely on myself", "Change is always bad"...`}
                            defaultValue={event?.beliefCreated ?? ""}
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="downstreamEffects">What it changed later</Label>
                        <Textarea
                            id="downstreamEffects"
                            name="downstreamEffects"
                            placeholder="How did this affect later decisions, relationships, identity?"
                            defaultValue={event?.downstreamEffects ?? ""}
                            rows={2}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="layer">Layer</Label>
                            <select
                                id="layer"
                                name="layer"
                                defaultValue={event?.layer ?? "life_event"}
                                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                            >
                                {layerOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eraId">Era</Label>
                            <select
                                id="eraId"
                                name="eraId"
                                defaultValue={event?.eraId ?? ""}
                                className="flex h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm shadow-xs outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                            >
                                <option value="">No era</option>
                                {eras.map((era) => (
                                    <option key={era.id} value={era.id}>
                                        {era.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </>
            )}

            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                        Add
                    </Button>
                </div>
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-sm"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">
                    {event ? "Save changes" : "Add event"}
                </Button>
            </div>
        </form>
    );
}
