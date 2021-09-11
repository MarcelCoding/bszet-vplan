import { formatRelativeTime } from "./utils";
import { notify, notifyDiscord, notifyTelegram } from "./notification";

const V_PLAN_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";

export async function vPlanCron() {
  const [modified, lastModified] = await Promise.all([
    loadModified(),
    loadLastModified(),
  ]);

  if (modified && (!lastModified || modified !== lastModified)) {
    const passedTime = formatRelativeTime(Date.parse(modified) - Date.now());
    const message = `VPlan has been updated ${passedTime}. To view the changes visit ${V_PLAN_URL}.`;

    return Promise.all([updateLastModified(modified), notify(message)]);
  }
}

async function loadModified() {
  const response = await fetch(V_PLAN_URL, {
    method: "HEAD",
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  return response.headers.get("last-modified");
}

async function loadLastModified() {
  return BSZET_VPLAN.get("last-modified");
}

async function updateLastModified(modified) {
  return BSZET_VPLAN.put("last-modified", modified);
}
