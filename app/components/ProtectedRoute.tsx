// components/ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status, data } = useSession();
  console.log(status, data);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen />;
  }

  if (status === "authenticated") {
    return <>{children}</>;
  }

  return null;
}
