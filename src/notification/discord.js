const HOOKS = JSON.parse(DISCORD_HOOKS);

export async function notifyDiscord(message) {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  };

  return Promise.all(HOOKS.map((hook) => fetch(hook, request)));
}
