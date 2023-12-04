import { z } from "zod";
import { GlobalDatabaseClient } from "../common/database";
import { messages } from "../schema";
import { resolveSessionTokenIntoUserOrFail } from "../common/auth";
import { getChatMessages } from "./getChatMessages";

export const sendChatMessageSchema = z.object({
    token: z.string(),
    messageContent: z.string(),
})

type SendChatMessageInput = z.infer<typeof sendChatMessageSchema>

export async function sendChatMessage(input: SendChatMessageInput) {
    console.log('sendChatMessage', input)
    const user = await resolveSessionTokenIntoUserOrFail(input.token)
    console.log('user', user)

    await GlobalDatabaseClient.insert(messages).values({
        messageContent: input.messageContent,
        userId: user.id,
        createdAt: new Date(),
    })

    return await getChatMessages()
}
