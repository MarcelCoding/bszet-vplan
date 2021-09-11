import { notifyTelegram } from "./telegram";
import { notifyDiscord } from "./discord";

export async function notify(message, image, messageWithoutImage) {
  return Promise.all([
    notifyDiscord(messageWithoutImage, image),
    notifyTelegram(message, image, messageWithoutImage),
  ]);
}
