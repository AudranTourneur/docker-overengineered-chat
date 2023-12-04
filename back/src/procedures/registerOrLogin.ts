import { resolveSessionTokenIntoUserOrCreateUser } from "../common/auth";

export async function registerOrLogin(token: string | null) {
  return await resolveSessionTokenIntoUserOrCreateUser(token);
}
