import { notifyDiscord, notifyTelegram } from "./notification";

const V_PLAN_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";

export async function vPlanCron() {
  const [lastModified, oldLastModified] = await Promise.all([
    loadLastModified(),
    BSZET_VPLAN.get("last-modified"),
  ]);

  if (lastModified && (!oldLastModified || lastModified !== oldLastModified)) {
    const message = `VPlan has been changed. ${V_PLAN_URL}`;

    return await Promise.all([
      BSZET_VPLAN.put("last-modified", lastModified),
      notifyTelegram(JSON.parse(TELEGRAM_CHAT_IDS), message),
      notifyDiscord(JSON.parse(DISCORD_HOOKS), message),
    ]);
  }
}

async function loadLastModified() {
  const response = await fetch(V_PLAN_URL, {
    method: "HEAD",
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  return response.headers.get("last-modified");
}
