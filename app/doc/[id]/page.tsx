"use client";

import Document from "@/components/Document";
import { use } from "react";

interface DocumentPageProps {
    params: Promise<{ id: string }>
}

const DocumentPage = ({ params }: DocumentPageProps) => {
    const { id } = use(params);
    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    );
};

export default DocumentPage;
