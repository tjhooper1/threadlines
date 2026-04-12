import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getEvents } from "./actions";
import { EventCard } from "@/components/events/event-card";

export default async function EventsPage() {
    const eventList = await getEvents();

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Events</h1>
                    <p className="text-muted-foreground">
                        Key moments that shaped who you are.
                    </p>
                </div>
                <Button render={<Link href="/app/events/new" />}>
                    <Plus />
                    New event
                </Button>
            </div>
            <Separator />
            {eventList.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">
                        No events yet. Start adding the moments that shaped your life.
                    </p>
                    <Button className="mt-4" render={<Link href="/app/events/new" />}>
                        <Plus />
                        Add your first event
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {eventList.map((data) => (
                        <EventCard key={data.event.id} data={data} />
                    ))}
                </div>
            )}
        </div>
    );
}
