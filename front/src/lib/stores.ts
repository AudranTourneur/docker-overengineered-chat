import { writable } from "svelte/store";
import type { RouterOutput } from "./trpc";

type User = {
    id: number
    username: string
    token: string
}

export const currentUser = writable<null | User>(null)

type ChatMessage = RouterOutput['getChatMessages'][0]

export const chatMessages = writable<ChatMessage[]>([])
