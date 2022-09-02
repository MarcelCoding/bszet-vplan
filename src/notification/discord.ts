export async function notifyDiscord(hooks: string[], message: string) {
  const request = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message }),
  };

  return await Promise.all(hooks.map((hook) => fetch(hook, request)));
}
