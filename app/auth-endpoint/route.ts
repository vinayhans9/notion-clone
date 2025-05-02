import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    auth.protect();
    const { sessionClaims } = await auth();
    const user = await currentUser();
    if (!user) {
        throw new Error("User not found")
    }
    const { room } = await req.json();
    const email = user?.emailAddresses[0]?.emailAddress;

    const session = liveblocks.prepareSession(email!, {
        userInfo: {
            name: user.firstName!,
            email: email!,
            avatar: user.imageUrl!
        }
    });

    const usersInRoom = await adminDb
        .collectionGroup("rooms")
        .where("userId", "==", email)
        .get();

    const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);

    if (userInRoom?.exists) {
        session.allow(room, session.FULL_ACCESS);
        const { body, status } = await session.authorize();

        return new Response(body, { status });
    } else {
        return new Response(
            JSON.stringify({ error: "You are not in this room" }),
            {
                status: 403,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}