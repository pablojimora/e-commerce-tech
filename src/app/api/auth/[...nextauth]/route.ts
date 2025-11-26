import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcrypt";
import dbConnection from "@/app/lib/dbconection";
import Users from "@/app/models/user";


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
    callbacks: {
        async signIn({ user, account }) {
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
            }

            return true;
        },
        async jwt({ token, user }) {
            // If there's a freshly authenticated user, attach role and id to token
            if (user) {
                token.role = (user as any).role || "user";
                token.id = (user as any).id || token.sub;
                token.sub = (user as any).id || token.sub;
            }

            // If token lacks role or id (e.g., social login where user object has no role), fetch from DB by email
            if ((!token.role || !token.id) && token?.email) {
                try {
                    await dbConnection();
                    const dbUser = await Users.findOne({ email: token.email });
                    if (dbUser) {
                        token.role = token.role || dbUser.role || "user";
                        token.id = token.id || dbUser._id.toString();
                        token.sub = token.sub || dbUser._id.toString();
                    }
                } catch (err) {
                    // ignore DB errors here - token will proceed without role
                }
            }

            return token;
        },
        async session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    role: token.role,
                },
            };
        }
        ,
    },
    pages: {
        signIn: "/login",
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
