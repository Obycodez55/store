"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { LogOut, LogIn, User } from "lucide-react";

export const UserMenu = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />;
  }

  if (status === "unauthenticated") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button
          onClick={() => router.push("/auth")}
          className="flex items-center gap-2 w-full md:w-auto"
          size="sm"
        >
          <LogIn className="h-4 w-4" />
          <span className="md:inline">Sign In</span>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto"
    >
      <div className="flex items-center gap-2 text-sm text-muted-foreground w-full md:w-auto">
        <User className="h-4 w-4 shrink-0" />
        <span className="truncate max-w-[200px]">{session.user?.email}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/auth" })}
        className="flex items-center gap-2 w-full md:w-auto"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </Button>
    </motion.div>
  );
};
