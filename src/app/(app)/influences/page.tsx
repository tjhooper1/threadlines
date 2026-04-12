import { Separator } from "@/components/ui/separator";

export default function InfluencesPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Influences</h1>
                <p className="text-muted-foreground">
                    The culture, media, and world that shaped you.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Songs, shows, games, books, places, trends, and communities that made
                    you who you are.
                </p>
            </div>
        </div>
    );
}
