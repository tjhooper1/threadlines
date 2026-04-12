import { Separator } from "@/components/ui/separator";

export default function TimelinePage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
                <p className="text-muted-foreground">
                    Your entire life, layered and explorable.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    The layered timeline will render here — life events, identity phases,
                    interests, emotions, and environment, all filterable.
                </p>
            </div>
        </div>
    );
}
