import { eq } from "drizzle-orm";
import { GlobalDatabaseClient } from "../common/database";
import { messages, users } from "../schema";

export async function getChatMessages() {
    // join with username
    const chatMessages = await GlobalDatabaseClient.select().from(messages).innerJoin(users, eq(messages.userId, users.id)).orderBy(messages.createdAt).limit(100);

    const chatMessagesWithUsername = chatMessages.map(chatMessage => {
        if (!chatMessage.users) throw new Error("chatMessage.users is null")
        if (!chatMessage.messages) throw new Error("chatMessage.users is null")
        return {
            id: chatMessage.users.id,
            messageContent: chatMessage.messages.messageContent,
            createdAt: chatMessage.messages.createdAt,
            username: chatMessage.users.username
        }
    });

    return chatMessagesWithUsername
}
