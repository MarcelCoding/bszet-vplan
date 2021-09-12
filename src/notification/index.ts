import { notifyTelegram } from "./telegram";
import { notifyDiscord } from "./discord";

export async function notify(
  message: string,
  image: string[] | null,
  messageWithoutImage: string
) {
  return Promise.all([
    notifyDiscord(messageWithoutImage),
    notifyTelegram(message, image, messageWithoutImage),
  ]);
}
