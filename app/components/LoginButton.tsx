"use client"; // Only for Next.js App Router (if using pages router, ignore this)

import { signIn, signOut, useSession } from "next-auth/react";

export function LoginButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Welcome, {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  ) : (
    <button onClick={() => signIn("google")}>Sign in with Google</button>
  );
}
