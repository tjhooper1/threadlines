import { Separator } from "@/components/ui/separator";
import { getEvents } from "@/app/app/events/actions";
import { getEras } from "@/app/app/eras/actions";
import { TimelineShell } from "@/components/timeline/timeline-shell";

export default async function TimelinePage() {
    const [eventsData, erasData] = await Promise.all([
        getEvents(),
        getEras(),
    ]);

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Timeline</h1>
                <p className="text-muted-foreground">
                    Your entire life, layered and explorable.
                </p>
            </div>
            <Separator />
            <TimelineShell events={eventsData} eras={erasData} />
        </div>
    );
}
