import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "../../../../models/user";
import { connectToDb } from "../../../../utils/database";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET
        })
    ],

    callbacks: {
        async session({session}) {
            try {
                const sessionUser = await User.findOne({ email: session.user.email });
        
                if (sessionUser) {
                  session.user.id = sessionUser._id.toString();
                }
        
                return session;
              } catch (error) {
                console.log("Error in session callback:", error);
                console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET)
                return session;
              }
        },

        async signIn({profile}) {
            
            try {

                // connect to the Db later
                await connectToDb()

                const userExists = await User.findOne({
                    email: profile.email,
                })
    
                if(!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(" ","").toLowerCase(),
                        image: profile.picture
                    })
                }

                return true;
            } catch (error) {
                console.log(error)
                return false
            }
        }
    }
})

export {handler as GET, handler as POST}