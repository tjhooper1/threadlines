"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function TraitListEditor({
    traits,
    onChange,
    placeholder = "Add a trait and press Enter",
}: {
    traits: string[];
    onChange: (traits: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    function addTrait() {
        const trimmed = input.trim();
        if (trimmed && !traits.includes(trimmed)) {
            onChange([...traits, trimmed]);
        }
        setInput("");
        inputRef.current?.focus();
    }

    function removeTrait(trait: string) {
        onChange(traits.filter((t) => t !== trait));
    }

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
                {traits.map((trait) => (
                    <Badge key={trait} variant="secondary" className="gap-1">
                        {trait}
                        <button
                            type="button"
                            onClick={() => removeTrait(trait)}
                            className="ml-0.5 rounded-full hover:bg-muted-foreground/20"
                        >
                            <X className="size-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Input
                ref={inputRef}
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInput(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        addTrait();
                    }
                }}
                placeholder={placeholder}
            />
        </div>
    );
}
