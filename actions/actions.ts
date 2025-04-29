'use server';

import { adminDb } from "@/firebase-admin";
import { auth, currentUser } from "@clerk/nextjs/server";

export const protectRoute = async () => {
    const { userId, sessionClaims, redirectToSignIn } = await auth();

    if (!userId || !sessionClaims) {
        redirectToSignIn();
    }

    return { userId, sessionClaims };
};

export const createNewDocument = async () => {
    const { userId, sessionClaims } = await protectRoute();

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
                createdAt: new Date(),
                roomId: docRef.id,
            });

        return { docId: docRef.id };

    } catch (error) {
        console.error("Error creating document:", error);
        throw new Error("Failed to create new document");
    }
};
