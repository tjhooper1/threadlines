"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEra, updateEra } from "@/app/(app)/eras/actions";

type Era = {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    summary: string | null;
    definingTraits: string[] | null;
    lessonLearned: string | null;
};

export function EraForm({
    era,
    onCancel,
}: {
    era?: Era;
    onCancel?: () => void;
}) {
    const [traits, setTraits] = useState<string[]>(era?.definingTraits ?? []);
    const [traitInput, setTraitInput] = useState("");

    const addTrait = () => {
        const trimmed = traitInput.trim();
        if (trimmed && !traits.includes(trimmed)) {
            setTraits([...traits, trimmed]);
            setTraitInput("");
        }
    };

    const removeTrait = (trait: string) => {
        setTraits(traits.filter((t) => t !== trait));
    };

    return (
        <form action={era ? updateEra : createEra} className="space-y-4">
            {era && <input type="hidden" name="id" value={era.id} />}
            <input type="hidden" name="definingTraits" value={JSON.stringify(traits)} />

            <div className="space-y-2">
                <Label htmlFor="name">Era name *</Label>
                <Input
                    id="name"
                    name="name"
                    placeholder={`"Small Town Years", "Grind Mode", "Starting Over"...`}
                    defaultValue={era?.name ?? ""}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startDate">Start date</Label>
                    <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        defaultValue={era?.startDate ?? ""}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endDate">End date</Label>
                    <Input
                        id="endDate"
                        name="endDate"
                        type="date"
                        defaultValue={era?.endDate ?? ""}
                    />
                    <p className="text-xs text-muted-foreground">
                        Leave blank if ongoing
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                    id="summary"
                    name="summary"
                    placeholder="A brief description of this era..."
                    defaultValue={era?.summary ?? ""}
                    rows={3}
                />
            </div>

            <div className="space-y-2">
                <Label>Defining traits</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a trait..."
                        value={traitInput}
                        onChange={(e) => setTraitInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                addTrait();
                            }
                        }}
                    />
                    <Button type="button" variant="outline" onClick={addTrait}>
                        Add
                    </Button>
                </div>
                {traits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                        {traits.map((trait) => (
                            <span
                                key={trait}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-sm"
                            >
                                {trait}
                                <button
                                    type="button"
                                    onClick={() => removeTrait(trait)}
                                    className="ml-0.5 text-muted-foreground hover:text-foreground"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="lessonLearned">Lesson learned</Label>
                <Textarea
                    id="lessonLearned"
                    name="lessonLearned"
                    placeholder="What did this era teach you?"
                    defaultValue={era?.lessonLearned ?? ""}
                    rows={2}
                />
            </div>

            <div className="flex justify-end gap-2 pt-2">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">{era ? "Save changes" : "Create era"}</Button>
            </div>
        </form>
    );
}
