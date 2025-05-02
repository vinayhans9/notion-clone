'use server';

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth, currentUser } from "@clerk/nextjs/server";

export const protectRoute = async () => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    if (!userId || !sessionClaims) {
        redirectToSignIn();
    }

    return { userId, sessionClaims };
};

export const createNewDocument = async () => {
    await protectRoute();

    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }

    const email = user.emailAddresses[0]?.emailAddress;
    if (!email) {
        throw new Error("Email not found for user");
    }

    try {
        const docRef = await adminDb.collection("documents").add({
            title: "New Doc",
        });

        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(docRef.id)
            .set({
                userId: email,
                role: "owner",
                name: `${user?.firstName} ${user?.lastName}`,
                createdAt: new Date(),
                roomId: docRef.id,
            });

        return { docId: docRef.id };

    } catch (error) {
        console.error("Error creating document:", error);
        throw new Error("Failed to create new document");
    }
};

export const deleteDocument = async (roomId: string) => {
    auth.protect();

    try {
        // delete the document reference itself
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();

        const batch = adminDb.batch();

        // delete the room reference in the user's collection for every user in the room
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        // delete the room in liveblocks
        await liveblocks.deleteRoom(roomId);

        return { success: true };
    } catch (err) {
        return { success: false }
    }
}

export const inviteUserToDocument = async (roomId: string, email: string) => {
    auth.protect();

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: "editor",
                createdAt: new Date(),
                roomId,
            });

        return { success: true };
    } catch (err) {
        return { success: false };
    }
}

export const removeUserFromDocument = async (roomId: string, email: string) => {
    auth.protect();

    try {
        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete();
        return { success: true };
    } catch (err) {
        return { success: false };
    }
}