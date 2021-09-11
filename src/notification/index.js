import { notifyDiscord } from "./discord";
import { notifyTelegram } from "./telegram";

export async function notify(message) {
  return Promise.all([notifyDiscord(message), notifyTelegram(message)]);
}
