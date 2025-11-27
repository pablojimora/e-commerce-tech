import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnection from "@/app/lib/dbconection";
import Users from "@/app/models/user";

// Extender tipos de NextAuth
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
            role: string;
        };
    }
    interface User {
        id: string;
        email: string;
        name?: string | null;
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        sub: string;
    }
}

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Correo", type: "text" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                await dbConnection();
                const user = await Users.findOne({ email: credentials.email });
                if (!user || !user.password) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name || user.email,
                    role: user.role || "user",
                };
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 días
    },
    cookies: {
        sessionToken: {
            name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                await dbConnection();

                if (account?.provider === "google") {
                    let dbUser = await Users.findOne({ email: user.email });
                    if (!dbUser) {
                        dbUser = await Users.create({
                            email: user.email,
                            name: user.name,
                            role: "user",
                        });
                    }
                    // Asignar datos del usuario de BD al objeto user para que estén disponibles en jwt callback
                    (user as any).id = dbUser._id.toString();
                    (user as any).role = dbUser.role || "user";
                }

                return true;
            } catch (error) {
                console.error("Error en signIn callback:", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            // Si es primera vez (user existe), asignar datos
            if (user) {
                token.role = (user as any).role || "user";
                token.id = (user as any).id || token.sub;
                token.sub = (user as any).id || token.sub;
            }

            // Si no tiene role/id, buscar en BD (fallback de seguridad)
            if ((!token.role || !token.id) && token?.email) {
                try {
                    await dbConnection();
                    const dbUser = await Users.findOne({ email: token.email });
                    if (dbUser) {
                        token.role = dbUser.role || "user";
                        token.id = dbUser._id.toString();
                        token.sub = dbUser._id.toString();
                    }
                } catch (err) {
                    console.error("Error fetching user in jwt callback:", err);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    ...session.user,
                    id: token.id || token.sub,
                    role: token.role || "user",
                };
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
