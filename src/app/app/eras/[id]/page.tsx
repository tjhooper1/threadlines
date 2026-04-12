import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { EraForm } from "@/components/eras/era-form";
import { getEra } from "../actions";

export default async function EditEraPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const era = await getEra(id);

    if (!era) {
        notFound();
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Era</h1>
                <p className="text-muted-foreground">
                    Update &ldquo;{era.name}&rdquo;
                </p>
            </div>
            <Separator />
            <div className="mx-auto w-full max-w-xl">
                <EraForm era={era} />
            </div>
        </div>
    );
}
