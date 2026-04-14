"use client";

import { useState, useTransition } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TraitListEditor } from "@/components/identity/trait-list-editor";
import {
    createIdentitySnapshot,
    updateIdentitySnapshot,
} from "@/app/app/identity/actions";
import { Save } from "lucide-react";

type SnapshotData = {
    id: string;
    pastSelf: string[] | null;
    currentSelf: string[] | null;
    futureSelf: string[] | null;
    notes: string | null;
    capturedAt: Date;
} | null;

const COLUMNS = [
    {
        key: "pastSelf" as const,
        title: "Who I Was",
        description: "Traits, labels, and identities from your past",
        placeholder: "e.g., shy, athletic, anxious...",
        color: "border-t-amber-400",
    },
    {
        key: "currentSelf" as const,
        title: "Who I Am",
        description: "How you see yourself right now",
        placeholder: "e.g., confident, creative, grounded...",
        color: "border-t-blue-400",
    },
    {
        key: "futureSelf" as const,
        title: "Who I'm Becoming",
        description: "The person you're growing into",
        placeholder: "e.g., leader, at peace, adventurous...",
        color: "border-t-emerald-400",
    },
];

export function IdentityEditor({
    snapshot,
}: {
    snapshot: SnapshotData;
}) {
    const [pastSelf, setPastSelf] = useState<string[]>(
        snapshot?.pastSelf ?? [],
    );
    const [currentSelf, setCurrentSelf] = useState<string[]>(
        snapshot?.currentSelf ?? [],
    );
    const [futureSelf, setFutureSelf] = useState<string[]>(
        snapshot?.futureSelf ?? [],
    );
    const [notes, setNotes] = useState(snapshot?.notes ?? "");
    const [isPending, startTransition] = useTransition();

    const setters = {
        pastSelf: setPastSelf,
        currentSelf: setCurrentSelf,
        futureSelf: setFutureSelf,
    };
    const values = { pastSelf, currentSelf, futureSelf };

    function handleSave() {
        const formData = new FormData();
        formData.set("pastSelf", JSON.stringify(pastSelf));
        formData.set("currentSelf", JSON.stringify(currentSelf));
        formData.set("futureSelf", JSON.stringify(futureSelf));
        if (notes) formData.set("notes", notes);

        if (snapshot) {
            formData.set("id", snapshot.id);
            startTransition(() => updateIdentitySnapshot(formData));
        } else {
            startTransition(() => createIdentitySnapshot(formData));
        }
    }

    function handleSaveNewVersion() {
        const formData = new FormData();
        formData.set("pastSelf", JSON.stringify(pastSelf));
        formData.set("currentSelf", JSON.stringify(currentSelf));
        formData.set("futureSelf", JSON.stringify(futureSelf));
        if (notes) formData.set("notes", notes);
        startTransition(() => createIdentitySnapshot(formData));
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                {COLUMNS.map((col) => (
                    <Card key={col.key} className={`border-t-4 ${col.color}`}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {col.title}
                            </CardTitle>
                            <CardDescription>
                                {col.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TraitListEditor
                                traits={values[col.key]}
                                onChange={setters[col.key]}
                                placeholder={col.placeholder}
                            />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">Reflection Notes</Label>
                <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNotes(e.target.value)
                    }
                    placeholder="Any thoughts on your identity right now..."
                    rows={3}
                />
            </div>

            <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isPending}>
                    <Save className="mr-1.5 size-4" />
                    {snapshot ? "Update" : "Save"} Snapshot
                </Button>
                {snapshot && (
                    <Button
                        variant="outline"
                        onClick={handleSaveNewVersion}
                        disabled={isPending}
                    >
                        Save as New Version
                    </Button>
                )}
            </div>
        </div>
    );
}
