import GoogleProvider from "next-auth/providers/google";
import db from "@/app/lib/db";

export const NEXT_AUTH_CONFIG = {
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    
    callbacks: {
        async signIn(params: any) {
        try {
                if (!params.user.email) {
                    return false;
                }
                const user = await db.user.findFirst({
                    where: {
                        email: params.user.email,
                    },
                });
                if (user) {
                    return true;
                }
                await db.user.create({
                    data: {
                        email: params.user.email,
                        provider: "Google",
                    },
                });
                return true;
            } catch (error) {
                console.log(error);
                return false;
            }
        },
        async session({ session, token }: any) {
            const user = await db.user.findFirst({
                where: {
                    email: session.user.email,
                },
            });
            if (user) {
                session.user.id = user.id;
            }
            return session; 
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
};
