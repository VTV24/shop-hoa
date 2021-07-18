import NextAuth, { Session, User } from 'next-auth';
import Providers from 'next-auth/providers';
import accountApi from '~src/services/account';

const auth = NextAuth({
    providers: [
        Providers.Email({
            id: 'email',
            server: process.env.MAIL_SERVER,
            from: process.env.MAIL_FROM,
        }),
        Providers.Credentials({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials: any) => {
                const user: User = {
                    _id: credentials._id,
                    isAdmin: credentials.isAdmin,
                    address: credentials.address,
                    phone: credentials.phone,
                    email: credentials.email,
                    image: credentials.image || '/images/user.png',
                    name: credentials.name,
                };
                if (user._id) {
                    return user;
                } else {
                    return Promise.reject(new Error('Đăng nhập không thành công'));
                }
            },
        }),
        Providers.GitHub({
            id: 'github',
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET_KEY,
        }),
        Providers.Facebook({
            id: 'facebook',
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_SECRET_KEY,
        }),
    ],
    database: process.env.DATABASE_URL,

    jwt: {
        secret: '12345678abcdef',
        maxAge: 60 * 60 * 60 * 24,
    },
    session: {
        jwt: true,
    },
    pages: {
        signIn: '/account/login',
        signOut: '/account/login',
    },
    callbacks: {
        signIn: (user, account, profile) => {
            return Promise.resolve(true);
        },
        jwt: async (token, user, account, profile, isNewUser) => {
            let _token = token;

            if (user?.email) {
                if (account?.type === 'credentials') {
                    _token = {
                        ...token,
                        ...user,
                    };
                } else {
                    const _res = await accountApi.getInfo({
                        email: user.email,
                    });

                    _token = {
                        ...token,
                        ..._res.data.data,
                    };
                }
            }
            return _token;
        },
        redirect: async (url, baseUrl) => {
            return url.startsWith(url) ? Promise.resolve(url) : Promise.resolve(baseUrl);
        },
        session: async (session: Session, user: User) => {
            if (user) {
                session.user = user;
            }
            return session;
        },
    },
});

export default auth;
