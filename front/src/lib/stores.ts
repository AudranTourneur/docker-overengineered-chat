import { writable } from "svelte/store";

type User = {
    id: number
    username: string
    token: string
}

export const currentUser = writable<null | User>(null)
