"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth(redirectTo: string = "/auth") {
  const data = useSession();
  console.log(data)
  const router = useRouter();
  useEffect(() => {
    if (data.status === "unauthenticated") {
      router.push(redirectTo);
    }
  }, [data, router, redirectTo]);

  return { session: data.data, status: data.status };
}
