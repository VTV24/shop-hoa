import NextAuth from 'next-auth';
import { IRoleName } from './utils';

declare module 'next-auth' {
    declare interface User extends Omit<IUser, 'password'> {}

    declare interface Session {
        user?: User;
        expires?: string;
    }
}
