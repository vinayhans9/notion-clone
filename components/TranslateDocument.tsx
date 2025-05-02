"use client";

import { useState, useTransition } from "react";
import Markdown from "react-markdown";
import * as Y from "yjs";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BotIcon, LanguagesIcon } from "lucide-react";
import { toast } from "sonner";

type Language =
    "english" |
    "spanish" |
    "french" |
    "german" |
    "hindi" |
    "russian" |
    "japanese";

const languages: Language[] = [
    "english",
    "spanish",
    "french",
    "german",
    "hindi",
    "russian",
    "japanese"
]

const TranslateDocument = ({ doc }: { doc: Y.Doc }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("");
    const [summary, setSummary] = useState<string>("");
    const [question, setQuestion] = useState<string>("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentData,
                    targetLang: language,
                })
            }
            );

            if (res.ok) {
                const { translated_text } = await res.json();
                setSummary(translated_text);
                toast.success(`Translated to ${language?.charAt(0)?.toUpperCase() + language.slice(1)} successfully`)
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the document!</DialogTitle>
                    <DialogDescription>
                        Select a language and AI will translate a summary of the document in the selected language.
                    </DialogDescription>

                    <hr className="mt-5" />

                    {question && <p className="mt-5 text-gray-500">Q: {question}</p>}

                </DialogHeader>

                {
                    summary && (
                        <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
                            <div className="flex">
                                <BotIcon className="w-10 flex-shrink-0" />
                                    <p className="font-bold">
                                        GPT {isPending ? "is thinking..." : "Says:"}
                                    </p>
                            </div>
                            {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
                        </div>
                    )
                }

                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Select
                        onValueChange={(value) => setLanguage(value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                languages?.map((item, key) => (
                                    <SelectItem
                                        key={key}
                                        value={item}
                                    >
                                        {item?.charAt(0)?.toUpperCase() + item.slice(1)}
                                    </SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <Button
                        type="submit"
                        disabled={!language || isPending}
                    >
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TranslateDocument