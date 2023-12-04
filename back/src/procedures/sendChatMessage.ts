import { z } from "zod";

export const sendChatMessageSchema = z.object({
    token: z.string(),
    messageContent: z.string(),
})

export async function sendMessage() {
}
