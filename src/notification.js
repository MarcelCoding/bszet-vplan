export async function notifyTelegram(chatIds, message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  return await Promise.all(
    chatIds.map((id) => fetch(url, generateTelegramRequest(id, message)))
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

export async function notifyDiscord(hooks, message) {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  };

  return await Promise.all(hooks.map((hook) => fetch(hook, request)));
}
