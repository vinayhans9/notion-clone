"use client";

import {
    ClientSideSuspense,
    RoomProvider as RoomProvideWrapper
} from "@liveblocks/react/suspense";
import LoadingSpinner from "./LoadingSpinner";
import LiveCursorProvider from "./LiveCursorProvider";

const RoomProvider = ({ roomId, children }: {
    roomId: string;
    children: React.ReactNode;
}) => {
    return (
        <RoomProvideWrapper
            id={roomId}
            initialPresence={{
                cursor: null
            }}
        >
            <ClientSideSuspense fallback={<LoadingSpinner />}>
                <LiveCursorProvider>
                    {children}
                </LiveCursorProvider>
            </ClientSideSuspense>
        </RoomProvideWrapper>
    )
}

export default RoomProvider