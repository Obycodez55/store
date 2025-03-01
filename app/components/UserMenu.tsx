"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <Link href="/auth">
        <Button variant="outline">Sign in</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            {session.user.shopName || session.user.name?.split(" ")[0]}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
