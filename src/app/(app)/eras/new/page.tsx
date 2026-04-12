import { Separator } from "@/components/ui/separator";
import { EraForm } from "@/components/eras/era-form";

export default function NewEraPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">New Era</h1>
                <p className="text-muted-foreground">
                    Name a chapter of your life.
                </p>
            </div>
            <Separator />
            <div className="mx-auto w-full max-w-xl">
                <EraForm />
            </div>
        </div>
    );
}
