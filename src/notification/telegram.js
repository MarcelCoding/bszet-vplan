const CHAT_IDS = JSON.parse(TELEGRAM_CHAT_IDS);

export async function notifyTelegram(message, image, messageWithoutImage) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

  return Promise.all(
    CHAT_IDS.map((id) => request(url, id, message, image, messageWithoutImage))
  );
}

async function request(api, id, message, image, messageWithoutImage) {
  return image
    ? fetch(`${api}/sendDocument`, imageMessage(id, message, image))
    : fetch(`${api}/sendMessage`, textMessage(id, messageWithoutImage));
}

function textMessage(chatId, message) {
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

function imageMessage(chatId, message, image) {
  const data = new FormData();
  data.append("chat_id", chatId);
  data.append("document", new Blob([image]), "vplan.jpg");
  data.append("caption", message);
  data.append("disable_notification", "true");

  return {
    method: "POST",
    body: data,
  };
}
