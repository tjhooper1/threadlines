"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles, RefreshCw, Download, Copy, Check } from "lucide-react";
import { generateLifeSummary } from "@/app/app/summary/actions";

type Tone = "reflective" | "factual" | "storytelling";

const TONES: { value: Tone; label: string; description: string }[] = [
    {
        value: "reflective",
        label: "Reflective",
        description: "Warm & introspective, second-person",
    },
    {
        value: "factual",
        label: "Factual",
        description: "Clear & biographical, third-person",
    },
    {
        value: "storytelling",
        label: "Storytelling",
        description: "Vivid & narrative, first-person memoir",
    },
];

export function SummaryGenerator() {
    const [tone, setTone] = useState<Tone>("reflective");
    const [summary, setSummary] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);

    function handleGenerate() {
        startTransition(async () => {
            const result = await generateLifeSummary(tone);
            setSummary(result);
        });
    }

    function handleCopy() {
        if (summary) {
            navigator.clipboard.writeText(summary);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleDownload() {
        if (!summary) return;
        const blob = new Blob([summary], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `threadline-summary-${tone}-${new Date().toISOString().split("T")[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="space-y-6">
            {/* Tone selector */}
            <div className="grid gap-3 sm:grid-cols-3">
                {TONES.map((t) => (
                    <button
                        key={t.value}
                        onClick={() => setTone(t.value)}
                        className={`rounded-lg border p-4 text-left transition-colors ${tone === t.value
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "hover:bg-muted/50"
                            }`}
                    >
                        <p className="text-sm font-medium">{t.label}</p>
                        <p className="text-xs text-muted-foreground">
                            {t.description}
                        </p>
                    </button>
                ))}
            </div>

            {/* Generate button */}
            <div className="flex items-center gap-3">
                <Button onClick={handleGenerate} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : summary ? (
                        <RefreshCw className="mr-2 h-4 w-4" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    {isPending
                        ? "Generating..."
                        : summary
                            ? "Regenerate"
                            : "Generate Summary"}
                </Button>
                {summary && (
                    <>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                        >
                            {copied ? (
                                <Check className="mr-1 h-3.5 w-3.5" />
                            ) : (
                                <Copy className="mr-1 h-3.5 w-3.5" />
                            )}
                            {copied ? "Copied" : "Copy"}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                        >
                            <Download className="mr-1 h-3.5 w-3.5" />
                            Download .txt
                        </Button>
                    </>
                )}
            </div>

            {/* Summary output */}
            {isPending && !summary && (
                <Card className="border-dashed">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                Reading your life story...
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {summary && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>
                            Generated in{" "}
                            <span className="capitalize">{tone}</span> tone
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                            {summary}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
