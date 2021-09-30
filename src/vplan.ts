import {
  checkChangesAndUpdate,
  fetchChangesPdf,
  parseAndStoreChanges,
} from "./changes";
import { formatDateTime, formatRelativeTime, pdf2Img } from "./utils";
import { getIteration } from "./iteration";
import { Changes } from "./domain";
import { notify } from "./notification";
import { getActualTimetable, getAsciiTimetable } from "./timetable";
import Toucan from "toucan-js";

const CHANGES_PDF_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";

export async function vPlanCron(sentry: Toucan): Promise<unknown> {
  const date = new Date();

  const lastModified = await checkChangesAndUpdate();
  if (
    (date.getUTCHours() === 15 && date.getUTCMinutes() < 14) ||
    !lastModified
  ) {
    return;
  }

  if (date.getUTCHours() >= 15) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  let data;
  let day;

  try {
    data = await fetchChanges(lastModified);
    day = await getActualTimetable("IGD21", date, data.changes);
  } catch (e) {
    sentry.captureException(e);
    console.error(e);
  }

  const passedTime = formatRelativeTime(lastModified.getTime() - Date.now());

  const iteration = getIteration();
  const message = day
    ? `Der Vertretungsplan wurde ${passedTime} aktualisiert. Alle fehlerhaften Daten bitte mit Screenshot des VPlans an Marcel weitergeben.\n\`\`\`\n${getAsciiTimetable(
        day.timetable
      )}\n\`\`\``
    : `Die PDF Api konnte nicht erreicht werden.\n\nDer Vertretungsplan wurde ${passedTime} aktualisiert. Alle fehlerhaften Daten bitte mit Screenshot des VPlans an Marcel weitergeben. Hier die Änderungen ansehen ${CHANGES_PDF_URL}. Der aktuelle Turnus ist ${iteration}.`;
  return notify(message, data?.images);
}

async function fetchChanges(
  actualLastModified: Date
): Promise<{ changes: Changes; images: string[] }> {
  const changesPdf = await fetchChangesPdf();

  const passedMs = actualLastModified.getTime() - Date.now();
  const passedTime = formatRelativeTime(passedMs);
  const iteration = getIteration();

  const [changes, images] = await Promise.all([
    parseAndStoreChanges(changesPdf),
    pdf2Img(
      changesPdf,
      formatDateTime(actualLastModified),
      `${passedTime} aktualisiert`,
      `Turnus ${iteration}`
    ),
  ]);

  return { changes, images };
}
