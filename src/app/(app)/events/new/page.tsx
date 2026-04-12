import { Separator } from "@/components/ui/separator";
import { EventForm } from "@/components/events/event-form";
import { getEras } from "@/app/(app)/eras/actions";

export default async function NewEventPage() {
    const eraList = await getEras();
    const eras = eraList.map((e) => ({ id: e.id, name: e.name }));

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">New Event</h1>
                <p className="text-muted-foreground">
                    Add a moment that shaped your life.
                </p>
            </div>
            <Separator />
            <div className="mx-auto w-full max-w-xl">
                <EventForm eras={eras} mode="quick" />
            </div>
        </div>
    );
}
