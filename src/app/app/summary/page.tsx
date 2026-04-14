import { Separator } from "@/components/ui/separator";
import { SummaryGenerator } from "@/components/summary/summary-generator";

export default function SummaryPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Life Summary
                </h1>
                <p className="text-muted-foreground">
                    An AI-generated narrative of your life. Choose a tone and
                    generate.
                </p>
            </div>
            <Separator />
            <SummaryGenerator />
        </div>
    );
}
