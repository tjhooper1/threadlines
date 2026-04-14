"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    createPersonalityEntry,
    updatePersonalityEntry,
} from "@/app/app/personality/actions";

type EraOption = { id: string; name: string };

type EntryData = {
    id: string;
    eraId: string | null;
    dimension: string;
    value: string | null;
    notes: string | null;
} | null;

const DIMENSIONS = [
    { value: "confidence", label: "Confidence" },
    { value: "introversion", label: "Introversion" },
    { value: "values", label: "Values" },
    { value: "triggers", label: "Triggers" },
    { value: "motivations", label: "Motivations" },
    { value: "strengths", label: "Strengths" },
    { value: "sabotage", label: "Self-Sabotage" },
];

export function PersonalityEntryForm({
    entry,
    eras,
    onDone,
}: {
    entry?: EntryData;
    eras: EraOption[];
    onDone?: () => void;
}) {
    const [dimension, setDimension] = useState(entry?.dimension ?? "");
    const [value, setValue] = useState(entry?.value ?? "");
    const [notes, setNotes] = useState(entry?.notes ?? "");
    const [eraId, setEraId] = useState(entry?.eraId ?? "");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const formData = new FormData();
        if (entry) formData.set("id", entry.id);
        formData.set("dimension", dimension);
        formData.set("value", value);
        if (notes) formData.set("notes", notes);
        if (eraId) formData.set("eraId", eraId);

        startTransition(async () => {
            if (entry) {
                await updatePersonalityEntry(formData);
            } else {
                await createPersonalityEntry(formData);
            }
            if (!entry) {
                setDimension("");
                setValue("");
                setNotes("");
                setEraId("");
            }
            onDone?.();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="dimension">Dimension</Label>
                    <select
                        id="dimension"
                        value={dimension}
                        onChange={(e) => setDimension(e.target.value)}
                        className="flex h-8 w-full rounded-md border bg-background px-3 text-sm"
                        required
                    >
                        <option value="">Select dimension...</option>
                        {DIMENSIONS.map((d) => (
                            <option key={d.value} value={d.value}>
                                {d.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="eraId">Era (optional)</Label>
                    <select
                        id="eraId"
                        value={eraId}
                        onChange={(e) => setEraId(e.target.value)}
                        className="flex h-8 w-full rounded-md border bg-background px-3 text-sm"
                    >
                        <option value="">No specific era</option>
                        {eras.map((era) => (
                            <option key={era.id} value={era.id}>
                                {era.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="value">Value / Description</Label>
                <Input
                    id="value"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setValue(e.target.value)
                    }
                    placeholder="Describe this dimension of yourself..."
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNotes(e.target.value)
                    }
                    placeholder="Any context or reflection..."
                    rows={2}
                />
            </div>

            <Button type="submit" disabled={isPending}>
                {entry ? "Update" : "Add"} Entry
            </Button>
        </form>
    );
}
