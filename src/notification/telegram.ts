const API_BASE_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

export async function notifyTelegram(
  chatIds: number[],
  message: string,
  images: string[] | undefined
): Promise<unknown> {
  return Promise.all(
    images?.length
      ? chatIds.map((chatId) => sendImages(chatId, message, images))
      : chatIds.map((chatId) => sendMessage(chatId, message))
  );
}

async function sendImages(
  chatId: number,
  message: string,
  images: string[]
): Promise<unknown> {
  let url: string;
  let body: {
    media?: {
      type: "photo";
      media: string;
      caption?: string;
      parse_mode?: "markdown";
    }[];
    photo?: string;
  };

  if (images.length === 1) {
    url = "sendPhoto";
    body = { photo: `${IMAGE_BASE_URL}/image/${images[0]}` };
  } else {
    url = "sendMediaGroup";
    body = {
      media: images.map((image) => ({
        type: "photo",
        media: `${IMAGE_BASE_URL}/image/${image}`,
      })),
    };
    body.media![0].caption = message;
    body.media![0].parse_mode = "markdown";
  }

  return await fetch(`${API_BASE_URL}/${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: createBody(chatId, body),
  });
}

async function sendMessage(chatId: number, message: string) {
  return fetch(`${API_BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: createBody(chatId, { text: message, parse_mode: "markdown" }),
  });
}

function createBody(chatId: number, body: object): string {
  return JSON.stringify({
    chat_id: chatId,
    disable_notification: true,
    ...body,
  });
}
