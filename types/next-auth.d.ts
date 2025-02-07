// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            tokens?: {
                access_token?: string;
                refresh_token?: string;
                expires_at?: number;
            };
        } & DefaultSession["user"];
        accessToken?: string;
    }

    interface JWT {
        accessToken?: string;
        refreshToken?: string;
    }
}