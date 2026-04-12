import { Separator } from "@/components/ui/separator";

export default function ArtifactsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Artifacts</h1>
                <p className="text-muted-foreground">
                    Photos, documents, and evidence that make your story real.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Upload and browse photos, voice notes, screenshots, playlists, and
                    more — linked to events and eras.
                </p>
            </div>
        </div>
    );
}
