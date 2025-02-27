// "use client";

<<<<<<< Updated upstream
// import { SessionProvider } from "next-auth/react";
// import { ThemeProvider } from "next-themes";
// import { Toaster } from "@/components/ui/toaster";
// import { ReactNode } from "react";
=======
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";
>>>>>>> Stashed changes

// interface ClientProvidersProps {
//   children: ReactNode;
// }

<<<<<<< Updated upstream
// export function ClientProviders({ children }: ClientProvidersProps) {
//   return (
//     <SessionProvider>
//       <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//         {children}
//         <Toaster />
//       </ThemeProvider>
//     </SessionProvider>
//   );
// }
=======
export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
      <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light">
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
>>>>>>> Stashed changes
