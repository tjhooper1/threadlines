"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import {
    createInfluence,
    updateInfluence,
} from "@/app/app/influences/actions";

type EraOption = { id: string; name: string };

type InfluenceData = {
    id: string;
    category: string;
    name: string;
    eraId: string | null;
    ageOrYear: string | null;
    whyItMattered: string | null;
    imageUrl: string | null;
} | null;

const CATEGORIES = [
    { value: "song", label: "Song" },
    { value: "show", label: "Show / Movie" },
    { value: "game", label: "Game" },
    { value: "book", label: "Book" },
    { value: "place", label: "Place" },
    { value: "internet", label: "Internet" },
    { value: "trend", label: "Trend" },
    { value: "family", label: "Family" },
    { value: "community", label: "Community" },
    { value: "subculture", label: "Subculture" },
];

export function InfluenceForm({
    influence,
    eras,
    onDone,
}: {
    influence?: InfluenceData;
    eras: EraOption[];
    onDone?: () => void;
}) {
    const [category, setCategory] = useState(influence?.category ?? "song");
    const [name, setName] = useState(influence?.name ?? "");
    const [eraId, setEraId] = useState(influence?.eraId ?? "");
    const [ageOrYear, setAgeOrYear] = useState(influence?.ageOrYear ?? "");
    const [whyItMattered, setWhyItMattered] = useState(
        influence?.whyItMattered ?? ""
    );
    const [imageUrl, setImageUrl] = useState(influence?.imageUrl ?? "");
    const [isPending, startTransition] = useTransition();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        const formData = new FormData();
        if (influence) formData.set("id", influence.id);
        formData.set("category", category);
        formData.set("name", name);
        if (eraId) formData.set("eraId", eraId);
        if (ageOrYear) formData.set("ageOrYear", ageOrYear);
        if (whyItMattered) formData.set("whyItMattered", whyItMattered);
        if (imageUrl) formData.set("imageUrl", imageUrl);

        startTransition(async () => {
            if (influence) {
                await updateInfluence(formData);
            } else {
                await createInfluence(formData);
            }
            if (!influence) {
                setName("");
                setAgeOrYear("");
                setWhyItMattered("");
                setImageUrl("");
            }
            onDone?.();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. The Smiths, Final Fantasy VII, Catcher in the Rye"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="eraId">Era</Label>
                    <select
                        id="eraId"
                        value={eraId}
                        onChange={(e) => setEraId(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">None</option>
                        {eras.map((era) => (
                            <option key={era.id} value={era.id}>
                                {era.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ageOrYear">Age or Year</Label>
                    <Input
                        id="ageOrYear"
                        value={ageOrYear}
                        onChange={(e) => setAgeOrYear(e.target.value)}
                        placeholder="e.g. 16 or 2005"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="whyItMattered">Why It Mattered</Label>
                <Textarea
                    id="whyItMattered"
                    value={whyItMattered}
                    onChange={(e) => setWhyItMattered(e.target.value)}
                    placeholder="What did this mean to you? How did it shape you?"
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... album cover, poster, etc."
                />
            </div>

            <div className="flex justify-end gap-2">
                {onDone && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onDone}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isPending || !name.trim()}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr-2 h-4 w-4" />
                    )}
                    {influence ? "Update" : "Add Influence"}
                </Button>
            </div>
        </form>
    );
}
