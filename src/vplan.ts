import { formatDateTime, formatRelativeTime, pdf2Img } from "./utils";
import { notify } from "./notification";
import { getIteration } from "./iteration";

const V_PLAN_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";

export async function vPlanCron(): Promise<unknown> {
  const [modified, lastModified] = await Promise.all([
    loadModified(),
    loadLastModified(),
  ]);

  if (modified && (!lastModified || modified !== lastModified)) {
    const passedTime = formatRelativeTime(Date.parse(modified) - Date.now());

    const iteration = getIteration();
    const message = `Der Vertretungsplan wurde ${passedTime} aktualisiert.`;
    const messageWithoutImage = `${message} Hier die Änderungen ansehen ${V_PLAN_URL}. Der aktuelle Turnus ist ${iteration}.`;

    return Promise.all([
      updateLastModified(modified),
      notify(
        `${message} Der aktuelle Turnus ist ${iteration}.`,
        await fetchVPlan(
          formatDateTime(new Date(modified)),
          `aktualisiert ${passedTime}`,
          `Turnus ${iteration}`
        ),
        messageWithoutImage
      ),
    ]);
  }
}

async function loadModified(): Promise<string | null> {
  const response = await fetch(V_PLAN_URL, {
    method: "HEAD",
    // @ts-ignore
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  return response.headers.get("last-modified");
}

async function loadLastModified(): Promise<string> {
  // @ts-ignore
  return BSZET_VPLAN.get("last-modified");
}

async function updateLastModified(modified: string): Promise<void> {
  // @ts-ignore
  return BSZET_VPLAN.put("last-modified", modified);
}

export async function fetchVPlan(
  line1: string,
  line2: string,
  line3: string
): Promise<string[] | null> {
  const response = await fetch(V_PLAN_URL, {
    // @ts-ignore
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  const data = await response.arrayBuffer();

  return pdf2Img(data, line1, line2, line3);
}
