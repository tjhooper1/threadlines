import { Separator } from "@/components/ui/separator";
import { getArtifacts } from "@/app/app/artifacts/actions";
import { getEras } from "@/app/app/eras/actions";
import { getEvents } from "@/app/app/events/actions";
import { ArtifactGallery } from "@/components/artifacts/artifact-gallery";

export default async function ArtifactsPage() {
    const [artifacts, erasData, eventsData] = await Promise.all([
        getArtifacts(),
        getEras(),
        getEvents(),
    ]);

    const eras = erasData.map((e) => ({ id: e.id, name: e.name }));
    const events = eventsData.map((e) => ({
        id: e.event.id,
        title: e.event.title,
    }));

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Artifacts</h1>
                <p className="text-muted-foreground">
                    Photos, documents, links, and evidence that make your story
                    real.
                </p>
            </div>
            <Separator />
            <ArtifactGallery
                artifacts={artifacts}
                eras={eras}
                events={events}
            />
        </div>
    );
}
