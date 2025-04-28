import credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import axios from "axios";

export const authOptions = {
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                user: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.user || !credentials.password) {
                    throw new Error("Missing credentials");
                }

                try {
                    // Query user by username
                    const result = await axios.get(`${process.env.BACKEND_URL}/api/v1/users`);
                    const user = result.data.find(user => user.username === credentials.user);

                    if (!user) {
                        throw new Error("Wrong Username");
                    }

                    const passwordMatch = await compare(credentials.password, user.password);

                    if (!passwordMatch) {
                        throw new Error("Wrong Password");
                    }

                    // You can shape the returned user object as needed
                    return {
                        id: user.id,
                        username: user.username
                        // ... any other fields you want
                    };
                } catch (e) {
                    console.error(e);
                }
            },
            async jwt({token, user}){
                if (user) {
                    token.id = user.id
                    token.username = user.username
                }
                return token
            },
            async session({session, token}){
                if (token) {
                    session.user.id = token.id;
                    session.user.username = token.username;
                }
                return session;
            }
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, credentials }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token, credentials }) {
            if (session?.user && token) {
                session.user.id = token.id;
                session.user.username = token.username;
            }
            return session;
        },
    }

};

export default authOptions;
