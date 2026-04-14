import { Separator } from "@/components/ui/separator";
import { getPersonalityEntries } from "@/app/app/personality/actions";
import { getEras } from "@/app/app/eras/actions";
import { PersonalityEntryForm } from "@/components/personality/personality-entry-form";
import { PersonalityEntryCard } from "@/components/personality/personality-entry-card";

const DIMENSION_ORDER = [
    "confidence",
    "introversion",
    "values",
    "triggers",
    "motivations",
    "strengths",
    "sabotage",
];

export default async function PersonalityPage() {
    const [entriesData, erasData] = await Promise.all([
        getPersonalityEntries(),
        getEras(),
    ]);

    const eras = erasData.map((e) => ({ id: e.id, name: e.name }));

    // Group entries by dimension
    const grouped = new Map<string, typeof entriesData>();
    for (const d of DIMENSION_ORDER) {
        grouped.set(d, []);
    }
    for (const item of entriesData) {
        const dim = item.entry.dimension;
        if (!grouped.has(dim)) grouped.set(dim, []);
        grouped.get(dim)!.push(item);
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Personality
                </h1>
                <p className="text-muted-foreground">
                    Your personality as a timeline, not a static label.
                </p>
            </div>
            <Separator />

            <PersonalityEntryForm eras={eras} />

            <Separator />

            {entriesData.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8">
                    <p className="text-muted-foreground">
                        No personality entries yet. Add one above to start
                        tracking yourself across dimensions.
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {[...grouped.entries()]
                        .filter(([, items]) => items.length > 0)
                        .map(([, items]) => (
                            <div
                                key={items[0].entry.dimension}
                                className="space-y-2"
                            >
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((item) => (
                                        <PersonalityEntryCard
                                            key={item.entry.id}
                                            data={item}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
