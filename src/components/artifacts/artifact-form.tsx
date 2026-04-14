"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import {
    createArtifact,
    updateArtifact,
    uploadArtifactFile,
} from "@/app/app/artifacts/actions";

type EraOption = { id: string; name: string };
type EventOption = { id: string; title: string };

type ArtifactData = {
    id: string;
    type: string;
    url: string;
    caption: string | null;
    date: string | null;
    eventId: string | null;
    eraId: string | null;
} | null;

const ARTIFACT_TYPES = [
    { value: "photo", label: "Photo" },
    { value: "video", label: "Video" },
    { value: "audio", label: "Audio" },
    { value: "document", label: "Document" },
    { value: "screenshot", label: "Screenshot" },
    { value: "text", label: "Text" },
    { value: "link", label: "Link" },
    { value: "playlist", label: "Playlist" },
];

const FILE_TYPES = ["photo", "video", "audio", "document", "screenshot"];
const LINK_TYPES = ["link", "playlist"];

export function ArtifactForm({
    artifact,
    eras,
    events,
    onDone,
}: {
    artifact?: ArtifactData;
    eras: EraOption[];
    events: EventOption[];
    onDone?: () => void;
}) {
    const [type, setType] = useState(artifact?.type ?? "photo");
    const [url, setUrl] = useState(artifact?.url ?? "");
    const [caption, setCaption] = useState(artifact?.caption ?? "");
    const [date, setDate] = useState(artifact?.date ?? "");
    const [eventId, setEventId] = useState(artifact?.eventId ?? "");
    const [eraId, setEraId] = useState(artifact?.eraId ?? "");
    const [isPending, startTransition] = useTransition();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const isFileType = FILE_TYPES.includes(type);
    const isLinkType = LINK_TYPES.includes(type) || type === "text";

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.set("file", file);
            const publicUrl = await uploadArtifactFile(formData);
            setUrl(publicUrl);
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setIsUploading(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!url) return;

        const formData = new FormData();
        if (artifact) formData.set("id", artifact.id);
        formData.set("type", type);
        formData.set("url", url);
        if (caption) formData.set("caption", caption);
        if (date) formData.set("date", date);
        if (eventId) formData.set("eventId", eventId);
        if (eraId) formData.set("eraId", eraId);

        startTransition(async () => {
            if (artifact) {
                await updateArtifact(formData);
            } else {
                await createArtifact(formData);
            }
            onDone?.();
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setUrl("");
                        if (fileInputRef.current)
                            fileInputRef.current.value = "";
                    }}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                >
                    {ARTIFACT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                            {t.label}
                        </option>
                    ))}
                </select>
            </div>

            {isFileType && (
                <div className="space-y-2">
                    <Label>Upload File</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileUpload}
                            accept={
                                type === "photo"
                                    ? "image/*"
                                    : type === "video"
                                        ? "video/*"
                                        : type === "audio"
                                            ? "audio/*"
                                            : undefined
                            }
                            disabled={isUploading}
                        />
                        {isUploading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                    </div>
                    {url && (
                        <p className="truncate text-xs text-muted-foreground">
                            Uploaded: {url}
                        </p>
                    )}
                </div>
            )}

            {(isLinkType || !isFileType) && (
                <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        <Input
                            id="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="What is this artifact about?"
                    rows={2}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
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
                    <Label htmlFor="eventId">Event</Label>
                    <select
                        id="eventId"
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    >
                        <option value="">None</option>
                        {events.map((evt) => (
                            <option key={evt.id} value={evt.id}>
                                {evt.title}
                            </option>
                        ))}
                    </select>
                </div>
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
                <Button
                    type="submit"
                    disabled={isPending || isUploading || !url}
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    {artifact ? "Update" : "Add Artifact"}
                </Button>
            </div>
        </form>
    );
}
