import { GlobalDatabaseClient } from "../common/database";
import { sessions, users } from "../schema";
import { eq} from 'drizzle-orm';
import crypto from 'crypto';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

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

type UserReturn = {
    id: number,
    username: string,
    token: string,
}

async function createUser(): Promise<UserReturn> {
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

export async function registerOrLogin(token: string | null) {
    if (!token) {
        return createUser();
    }
    GlobalDatabaseClient.select({
        id: sessions.userId,
    }).from(sessions).where(eq(sessions.token, token))
}
