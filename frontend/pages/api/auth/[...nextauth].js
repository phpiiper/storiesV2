import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt'
import axios from 'axios';

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                user: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.user || !credentials?.password) {
                    throw new Error("Missing credentials");
                }
                const auth = {Authorization: `Bearer ${process.env.AUTH_TOKEN}`}

                const users = await axios.get(`${process.env.BACKEND_URL}/api/v1/users`,{
                    headers: auth
                });
                const user = users.data.find(user => user.username === credentials.user);

                if (!user) {
                    throw new Error("No account found with that username");
                }
                const isValidPassword = await compare(credentials.password, user.password);
                if (!isValidPassword) {
                    throw new Error(`Password doesn’t match`);
                }

                return { id: user.id, username: user.username };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, credentials }) {
            // Here, you can log preferences data or perform extra checks
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.includes('/callback/credentials')) {
                return `${baseUrl}/`; // Or wherever you want to send users
            }
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        }
        ,
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
    },
});
