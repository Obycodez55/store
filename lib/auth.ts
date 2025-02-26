import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./prisma";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        // phone: { label: "Phone", type: "tel", placeholder: "+1234567890" },
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmai.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        console.log("credentials", { credentials });
        const user = await prisma.user.findFirst({
          // where: { vendor: { phone: credentials.phone } },
          where: { email: credentials.email },
          include: { vendor: true },
        });
        console.log("user loggedin", { user });
        if (!user) {
          throw new Error("Invalid phone number or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          name: user.name,
          phone: user.vendor?.phone,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallbacksecretdonotuseinproduction",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.vendor?.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(code, metadata);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug(code, metadata);
    },
  },
};

export default authOptions;
