import crypto from 'crypto';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';
import { GlobalDatabaseClient } from './database';
import { sessions, users } from '../schema';
import { eq} from 'drizzle-orm';

type UserReturn = {
    id: number,
    username: string,
    token: string,
}

export async function createUser(): Promise<UserReturn> {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });

    const [user] = await GlobalDatabaseClient.insert(users).values({
        username: randomName,
    }).returning();

    if (!user || !user.username) {
        throw new Error('User not created');
    }

    const token = await createSession(user.id);

    return {
        id: user.id,
        username: user.username,
        token,
    }
}

function generateCryptographicRandomToken(): string {
    return crypto.randomBytes(128).toString('hex');
}

async function createSession(userId: number): Promise<string> {
    const token = generateCryptographicRandomToken();

    await GlobalDatabaseClient.insert(sessions).values({
        token,
        userId,
    })

    return token;
}


export async function resolveSessionTokenIntoUserOrCreateUser(token: string | null): Promise<UserReturn> {
    if (!token) {
        console.log('Token null')
        return await createUser();
    }
    const userSessions = await GlobalDatabaseClient.select().from(sessions).where(eq(sessions.token, token)).innerJoin(users, eq(sessions.userId, users.id));

    if (userSessions.length === 0) {
        console.log('Token not found')
        return await createUser();
    }

    console.log('userSession', userSessions);

    const userSession = userSessions[0];

    return {
        id: userSession.users.id,
        username: userSession.users.username || '',
        token,
    }
}


export async function resolveSessionTokenIntoUserOrFail(token: string | null): Promise<UserReturn> {
    if (!token) {
        throw new Error('Token null')
    }
    const userSessions = await GlobalDatabaseClient.select().from(sessions).where(eq(sessions.token, token)).innerJoin(users, eq(sessions.userId, users.id));

    if (userSessions.length === 0) {
        throw new Error('Token not found')
    }

    const userSession = userSessions[0];

    return {
        id: userSession.users.id,
        username: userSession.users.username || '',
        token,
    }
}


