"use client";

import { protectRoute } from "@/actions/actions";
import RoomProvider from "@/components/RoomProvider";
import { use, useLayoutEffect } from "react";

const DocLayout = ({
    children, params
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>
}) => {
    const { id } = use(params);
    useLayoutEffect(() => {
        (async () => {
            await protectRoute();
        })()
    }, []);

    return (
        <RoomProvider roomId={id}>{children}</RoomProvider>
    )
}

export default DocLayout