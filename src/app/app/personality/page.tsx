import { Separator } from "@/components/ui/separator";

export default function PersonalityPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Personality</h1>
                <p className="text-muted-foreground">
                    Your personality as a timeline, not a static label.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Track confidence, values, motivations, strengths, and patterns across
                    eras — visualized over time.
                </p>
            </div>
        </div>
    );
}
