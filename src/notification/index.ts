import { notifyTelegram } from "./telegram";
import { notifyDiscord } from "./discord";

export async function notify(message: string, image: string[] | undefined) {
  return Promise.all([notifyDiscord(message), notifyTelegram(message, image)]);
}
