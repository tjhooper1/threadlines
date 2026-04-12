import { Separator } from "@/components/ui/separator";

export default function StatsPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Life Stats</h1>
                <p className="text-muted-foreground">
                    Your life in numbers.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Cities lived in, jobs held, years in relationships, most
                    transformative year, hardest season, and more.
                </p>
            </div>
        </div>
    );
}
