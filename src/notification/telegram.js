const CHAT_IDS = JSON.parse(TELEGRAM_CHAT_IDS);

export async function notifyTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  return Promise.all(
    CHAT_IDS.map((id) => fetch(url, generateTelegramRequest(id, message)))
  );
}

function generateTelegramRequest(chatId, message) {
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
