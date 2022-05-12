import {
  checkChangesAndUpdate,
  fetchChangesPdf,
  parseAndStoreChanges,
} from "./changes";
import {
  formatDateTime,
  formatLongDateTime,
  formatRelativeTime,
  pdf2Img,
} from "./utils";
import { getIteration } from "./iteration";
import { Changes, Config, Iteration } from "./domain";
import { notify } from "./notification";
import { getActualTimetable, getAsciiTimetable } from "./timetable";
import Toucan from "toucan-js";

const CHANGES_PDF_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";

export async function vPlanCron(sentry: Toucan): Promise<unknown> {
  const date = new Date();

  let pdf;
  let changes;

  if (15 <= date.getUTCHours()) {
    date.setUTCDate(date.getUTCDate() + 1);
  }

  if (date.getUTCDay() === 6) {
    // skip to next monday (day: 1)
    date.setUTCDate(date.getUTCDate() + 2);
  }

  if (date.getUTCDay() === 0) {
    // skip to next monday (day: 1)
    date.setUTCDate(date.getUTCDate() + 1);
  }

  const iteration = getIteration(date);
  if (!iteration) {
    throw new Error("Unable to gather iteration.");
  }

  try {  
    const { lastModified, modified } = await checkChangesAndUpdate();
    if (!(modified || (date.getUTCHours() === 15 && date.getUTCMinutes() <= 14))) {
      return;
    }
    pdf = await fetchChangesPdf();
    if (pdf) {
      changes = await parseAndStoreChanges(sentry, pdf);
    }
  } catch (e) {
    sentry.captureException(e);
    console.error(e);
  }

  const config: Config = JSON.parse(CONFIG);

  return Promise.all([
    processClass(
      sentry,
      date,
      lastModified,
      iteration,
      pdf,
      changes,
      "IGD21",
      config.IGD21.telegram,
      config.IGD21.discord
    ),
    processClass(
      sentry,
      date,
      lastModified,
      iteration,
      pdf,
      changes,
      "IGD20",
      config.IGD20.telegram,
      config.IGD20.discord
    ),
  ]);
}

async function processClass(
  sentry: Toucan,
  date: Date,
  lastModified: Date,
  iteration: Iteration,
  pdf: Blob | undefined,
  changes: Changes | undefined,
  clazz: string,
  telegram: number[],
  discord: string[]
): Promise<unknown> {
  let day;

  try {
    if (changes) day = await getActualTimetable(clazz, date, changes);
  } catch (e) {
    sentry.captureException(e);
    console.error(e);
  }

  const passedTime = formatRelativeTime(lastModified.getTime() - Date.now());

  let images;

  if (pdf) {
    images = await pdf2Img(
      pdf,
      formatDateTime(lastModified),
      `${passedTime} aktualisiert`,
      `Turnus ${iteration}`
    );
  }

  const message = day
    ? `Der Vertretungsplan wurde ${passedTime} aktualisiert. Alle fehlerhaften Daten bitte mit Screenshot des VPlans an Marcel weitergeben.\n\nVertretungsplan für ${formatLongDateTime(
        date
      )}. Der aktuelle Turnus ist ${iteration}.\n\n\`\`\`\n${getAsciiTimetable(
        day.timetable
      )}\n\`\`\``
    : `Beim Verarbeiten des Vertretungsplans ist ein Fehler aufgetreten.\n\nDer Vertretungsplan wurde eventuell ${passedTime} aktualisiert. Alle fehlerhaften Daten bitte mit Screenshot des VPlans an Marcel weitergeben. Hier die Änderungen ansehen ${CHANGES_PDF_URL}. Der aktuelle Turnus ist ${iteration}.`;
  return notify(message, images, telegram, discord);
}
