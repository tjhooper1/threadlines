import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { EventForm } from "@/components/events/event-form";
import { getEvent } from "../actions";
import { getEras } from "@/app/app/eras/actions";

export default async function EditEventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const [result, eraList] = await Promise.all([getEvent(id), getEras()]);

    if (!result) {
        notFound();
    }

    const eras = eraList.map((e) => ({ id: e.id, name: e.name }));

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Edit Event</h1>
                <p className="text-muted-foreground">
                    Update &ldquo;{result.event.title}&rdquo;
                </p>
            </div>
            <Separator />
            <div className="mx-auto w-full max-w-xl">
                <EventForm event={result.event} eras={eras} mode="full" />
            </div>
        </div>
    );
}
