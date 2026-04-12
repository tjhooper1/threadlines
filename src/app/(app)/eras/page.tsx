import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getEras } from "./actions";
import { EraCard } from "@/components/eras/era-card";

export default async function ErasPage() {
    const eraList = await getEras();

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Eras</h1>
                    <p className="text-muted-foreground">
                        The chapters of your life.
                    </p>
                </div>
                <Button render={<Link href="/app/eras/new" />}>
                    <Plus />
                    New era
                </Button>
            </div>
            <Separator />
            {eraList.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <p className="text-muted-foreground">
                        No eras yet. Start by naming the chapters of your life.
                    </p>
                    <Button className="mt-4" render={<Link href="/app/eras/new" />}>
                        <Plus />
                        Create your first era
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {eraList.map((era) => (
                        <EraCard key={era.id} era={era} />
                    ))}
                </div>
            )}
        </div>
    );
}
