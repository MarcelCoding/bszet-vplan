// @ts-ignore
const CHAT_IDS: number[] = JSON.parse(TELEGRAM_CHAT_IDS);

export async function notifyTelegram(
  message: string,
  image: BlobPart | null,
  messageWithoutImage: string
) {
  // @ts-ignore
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  return Promise.all(
    CHAT_IDS.map((id) => request(url, id, message, image, messageWithoutImage))
  );
}

async function request(
  api: string,
  id: number,
  message: string,
  image: BlobPart | null,
  messageWithoutImage: string
) {
  return image
    ? fetch(`${api}/sendDocument`, imageMessage(id, message, image))
    : fetch(`${api}/sendMessage`, textMessage(id, messageWithoutImage));
}

function imageMessage(chatId: number, message: string, image: BlobPart) {
  const data = new FormData();
  data.append("chat_id", `${chatId}`);
  data.append("document", new Blob([image]), "vplan.jpg");
  data.append("caption", message);
  data.append("disable_notification", "true");

  return {
    method: "POST",
    body: data,
  };
}

function textMessage(chatId: number, message: string) {
  return {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_notification: true,
    }),
  };
}
