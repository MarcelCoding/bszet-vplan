const CHAT_IDS = JSON.parse(TELEGRAM_CHAT_IDS);

export async function notifyTelegram(message, image) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`;

  return Promise.all(
    CHAT_IDS.map((id) => {
      return fetch(url, generateTelegramRequest(id, message, image));
    })
  );
}

function generateTelegramRequest(chatId, message, image) {
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
