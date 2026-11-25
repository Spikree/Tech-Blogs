import NextAuth from "next-auth";
import { currentUserId } from "@/lib/write-access";
import bcrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/user";
import { connectToDb } from "../../../../utils/database";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {};
                if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password || Buffer.byteLength(password) > 72) return null;

                if (credentials.intent === "register") {
                    const normalized = email.trim().toLowerCase();
                    if (normalized.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || password.length < 12) return null;

                    let stage = "connect";
                    try {
                        await connectToDb();
                        // Wait for the email index if Mongoose is building it.
                        stage = "index";
                        await User.init();
                        stage = "hash";
                        const passwordHash = await bcrypt.hash(password, 12);
                        // MongoDB checks for duplicate emails when it saves the new user.
                        stage = "insert";
                        const user = await User.create({
                            email: normalized,
                            username: normalized.split("@")[0],
                            passwordHash,
                        });
                        return { id: user.id, email: user.email, name: user.username };
                    } catch (error) {
                        console.error("[signup] failed", {
                            stage,
                            name: error.name,
                            code: error.code,
                            duplicateFields: error.code === 11000 ? Object.keys(error.keyPattern ?? {}) : undefined,
                        });
                        if (stage === "insert" && error.code === 11000 && error.keyPattern?.email) return null;
                        throw new Error("SignupUnavailable");
                    }
                }
                let stage = "connect";
                try {
                    await connectToDb();
                    stage = "lookup";
                    const user = await User.findOne({ email: email.trim().toLowerCase() })
                        .collation({ locale: "en", strength: 2 })
                        .select("+passwordHash");
                    if (!user?.passwordHash) return null;
                    stage = "verify";
                    if (!(await bcrypt.compare(password, user.passwordHash))) return null;
                    return { id: user.id, email: user.email, name: user.username, image: user.image };
                } catch (error) {
                    console.error("[credentials] sign-in failed", { stage, name: error.name, code: error.code });
                    throw new Error("SignInUnavailable");
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) token.dbUserId = user.id;
            return token;
        },
        async session({ session, token }) {
            try {
                const id = await currentUserId(token);
                if (!id) return null;
                session.user.id = id;
                return session;
            } catch {
                return null;
            }
        },

        async signIn({user, account, profile}) {
            // For email/password, authorize() runs first. If it rejects the login,
            // NextAuth never gets here. Returning true lets the authenticated user continue.
            if (account.provider === "credentials") return true;

            // Google sign-in skips authorize(). NextAuth has already validated Google's
            // response; here we also require Google to have verified the email address.
            if (!profile?.email_verified) return false;

            try {

                await connectToDb()

                const userExists = await User.findOne({
                    email: profile.email,
                }).collation({ locale: "en", strength: 2 }).select("+passwordHash");
                // Don't implicitly link an unverified password signup to a Google identity.
                if (userExists?.passwordHash) return false;

                const dbUser = userExists ?? await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                });
                user.id = dbUser.id;
                return true;
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
})

export {handler as GET, handler as POST}
