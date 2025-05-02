'use client';

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";
import { useRef } from "react";

const LiveCursorProvider = ({ children }: { children: React.ReactNode }) => {
    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const relativeX = (e.clientX - rect.left) / rect.width;
        const relativeY = (e.clientY - rect.top) / rect.height;

        updateMyPresence({
            cursor: { x: relativeX, y: relativeY }
        });
    }

    const handlePointerLeave = () => {
        updateMyPresence({ cursor: null });
    }

    return (
        <div
            ref={containerRef}
            style={{ position: "relative", width: "100%", height: "100%" }}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {
                others
                    .filter((other) => other.presence.cursor !== null)
                    .map(({ connectionId, presence, info }) => (
                        <FollowPointer
                            key={connectionId}
                            info={info}
                            x={presence.cursor!.x}
                            y={presence.cursor!.y}
                            containerRef={containerRef}
                        />
                    ))
            }
            {children}
        </div>
    )
}

export default LiveCursorProvider