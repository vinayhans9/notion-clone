"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import * as Y from "yjs";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";


const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
    const [input, setInput] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isPending, startTransition] = useTransition();
    const [summary, setSummary] = useState<string>("");
    const [question, setQuestion] = useState<string>("");

    const pathname = usePathname();
    const router = useRouter();

    const handleAskQuestion = async (e: FormEvent) => {
        e.preventDefault();

        setQuestion(input);
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentData,
                    question: input
                }),
            }
            );
            if (res.ok) {
                const { message } = await res.json();
                setInput("");
                setSummary(message);

                toast.success("Question asked successfully");
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Button asChild variant="outline">
                <DialogTrigger>
                    <MessageCircleCode />
                    Chat to Document
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chat to the Document!</DialogTitle>
                    <DialogDescription>
                        Ask a question and chat to the document with AI.
                    </DialogDescription>
                    <hr className="mt-5" />

                    {question && <p className="mt-5 text-left text-gray-500">Q: {question}</p>}
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
                    <Input
                        type="text"
                        placeholder="i.e: What is this about?"
                        className="w-full"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button
                        type="submit"
                        disabled={!input || isPending}
                    >
                        {isPending ? "Asking..." : "Ask"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>

    )
}

export default ChatToDocument