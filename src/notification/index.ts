import { notifyTelegram } from "./telegram";
import { notifyDiscord } from "./discord";

export async function notify(
  message: string,
  image: string[] | undefined,
  telegram: number[],
  discord: string[]
) {
  return await Promise.all([
    notifyTelegram(telegram, message, image),
    notifyDiscord(discord, message),
  ]);
}
