import { Separator } from "@/components/ui/separator";

export default function SummaryPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Life Summary</h1>
                <p className="text-muted-foreground">
                    An AI-generated narrative of your life.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Once you&apos;ve added enough events and eras, generate a warm,
                    insightful summary of your life story.
                </p>
            </div>
        </div>
    );
}
