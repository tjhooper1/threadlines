import { Separator } from "@/components/ui/separator";
import { IdentityEditor } from "@/components/identity/identity-editor";
import { SnapshotHistory } from "@/components/identity/snapshot-history";
import { getIdentitySnapshots } from "@/app/app/identity/actions";

export default async function IdentityPage() {
    const snapshots = await getIdentitySnapshots();
    const latest = snapshots[0] ?? null;

    return (
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Identity</h1>
                <p className="text-muted-foreground">
                    Who you were, who you are, who you&apos;re becoming.
                </p>
            </div>
            <Separator />
            <IdentityEditor snapshot={latest} />
            <Separator />
            <SnapshotHistory snapshots={snapshots} />
        </div>
    );
}
