"use client";

import { format } from "date-fns";
import { deleteEra } from "@/app/app/eras/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil } from "lucide-react";
import Link from "next/link";

type Era = {
    id: string;
    name: string;
    startDate: string | null;
    endDate: string | null;
    summary: string | null;
    definingTraits: string[] | null;
    lessonLearned: string | null;
    createdAt: Date;
};

function formatEraDate(dateStr: string | null) {
    if (!dateStr) return null;
    return format(new Date(dateStr), "MMM yyyy");
}

export function EraCard({ era }: { era: Era }) {
    const start = formatEraDate(era.startDate);
    const end = formatEraDate(era.endDate);
    const dateRange = start
        ? `${start} — ${end ?? "Present"}`
        : null;

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                    <CardTitle className="text-lg">{era.name}</CardTitle>
                    {dateRange && (
                        <CardDescription>{dateRange}</CardDescription>
                    )}
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" render={<Link href={`/app/eras/${era.id}`} />}>
                        <Pencil className="h-5 w-5" />
                    </Button>
                    <form action={deleteEra}>
                        <input type="hidden" name="id" value={era.id} />
                        <Button variant="ghost" size="icon-sm" type="submit">
                            <Trash2 className="h-5 w-5 text-destructive" />
                        </Button>
                    </form>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {era.summary && (
                    <p className="text-sm text-muted-foreground">{era.summary}</p>
                )}
                {era.definingTraits && era.definingTraits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {era.definingTraits.map((trait) => (
                            <Badge key={trait} variant="secondary">
                                {trait}
                            </Badge>
                        ))}
                    </div>
                )}
                {era.lessonLearned && (
                    <p className="text-sm italic text-muted-foreground">
                        &ldquo;{era.lessonLearned}&rdquo;
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
