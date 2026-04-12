import { Separator } from "@/components/ui/separator";

export default function IdentityPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Identity</h1>
                <p className="text-muted-foreground">
                    Who you were, who you are, who you&apos;re becoming.
                </p>
            </div>
            <Separator />
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                <p className="text-muted-foreground">
                    Three columns for your past self, current self, and future self —
                    editable, versionable, and evolving.
                </p>
            </div>
        </div>
    );
}
