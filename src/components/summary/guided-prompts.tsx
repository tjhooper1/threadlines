"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Loader2, Sparkles, RefreshCw } from "lucide-react";
import { generateReflectionPrompts } from "@/app/app/summary/actions";

export function GuidedPrompts() {
    const [prompts, setPrompts] = useState<string[] | null>(null);
    const [isPending, startTransition] = useTransition();

    function handleGenerate() {
        startTransition(async () => {
            const result = await generateReflectionPrompts();
            setPrompts(result);
        });
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Reflection Prompts
                </CardDescription>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={isPending}
                >
                    {isPending ? (
                        <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                    ) : prompts ? (
                        <RefreshCw className="mr-1 h-3.5 w-3.5" />
                    ) : (
                        <Sparkles className="mr-1 h-3.5 w-3.5" />
                    )}
                    {isPending
                        ? "Thinking..."
                        : prompts
                            ? "Refresh"
                            : "Generate"}
                </Button>
            </CardHeader>
            <CardContent>
                {!prompts && !isPending && (
                    <p className="text-sm text-muted-foreground">
                        Generate personalized reflection questions based on your
                        life data.
                    </p>
                )}
                {isPending && !prompts && (
                    <div className="flex items-center gap-2 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            Crafting questions from your story...
                        </p>
                    </div>
                )}
                {prompts && (
                    <ol className="space-y-2">
                        {prompts.map((prompt, i) => (
                            <li key={i} className="text-sm">
                                <span className="mr-2 text-muted-foreground">
                                    {i + 1}.
                                </span>
                                <span className="italic">{prompt}</span>
                            </li>
                        ))}
                    </ol>
                )}
            </CardContent>
        </Card>
    );
}
