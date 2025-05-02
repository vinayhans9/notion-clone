"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";

const Header = () => {
    const { user } = useUser();

    return <div className="flex items-center justify-between p-5 fixed top-0 left-0 w-full z-10 bg-white">
        {user && (
            <h1 className="text-2xl">
                {user?.firstName}
                {`'s`} Space
            </h1>
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs />
        <div>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
}

export default Header;