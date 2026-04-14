import { Separator } from "@/components/ui/separator";
import { getInfluences } from "@/app/app/influences/actions";
import { getEras } from "@/app/app/eras/actions";
import { InfluenceGrid } from "@/components/influences/influence-grid";

export default async function InfluencesPage() {
    const [influences, erasData] = await Promise.all([
        getInfluences(),
        getEras(),
    ]);

    const eras = erasData.map((e) => ({ id: e.id, name: e.name }));

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Influences
                </h1>
                <p className="text-muted-foreground">
                    The culture, media, and world that shaped you.
                </p>
            </div>
            <Separator />
            <InfluenceGrid influences={influences} eras={eras} />
        </div>
    );
}
