import {checkChangesAndUpdate, fetchChangesPdf, parseAndStoreChanges,} from "./changes";
import {formatDateTime, formatLongDateTime, formatRelativeTime, pdf2Img,} from "./utils";
import {getIteration} from "./iteration";
import {Changes, Config, Iteration} from "./domain";
import {notify} from "./notification";
import {getActualTimetable, getAsciiTimetable, getDefaultTimetable} from "./timetable";
import Toucan from "toucan-js";

export async function vPlanCron(sentry: Toucan): Promise<unknown> {
  const date = new Date();

  let pdf;
  let changes;

  // starting at 15h display next day
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

  let lastModified;

  try {
    const {lastModified: lm, modified} = await checkChangesAndUpdate();
    lastModified = lm;

    // vplan wasn't modified
    // between 15:00 and 15:14 UTC show timetable anyway
    if (!modified) {
      if (!(date.getUTCHours() === 15 && date.getUTCMinutes() > 14)) {
        return;
      }
    }

    if (lm) {
      pdf = await fetchChangesPdf();
      if (pdf) {
        changes = await parseAndStoreChanges(sentry, pdf);
      }
    }
  }
  catch (e) {
    sentry.captureException(e);
    console.error(e);
  }

  const config: Config = JSON.parse(CONFIG);

  return await Promise.all([
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
  lastModified: Date | undefined | null,
  iteration: Iteration,
  pdf: Blob | undefined,
  changes: Changes | undefined,
  clazz: string,
  telegram: number[],
  discord: string[]
): Promise<unknown> {
  let day;
  let error = false;

  try {
    if (changes) day = await getActualTimetable(clazz, date, changes);
  }
  catch (e) {
    sentry.captureException(e);
    console.error(e);
    error = true;
  }
  finally {
    if (!day) {
      day = {timetable: getDefaultTimetable(clazz, date, iteration)};
    }
  }

  const passedTime = lastModified ? formatRelativeTime(lastModified.getTime() - Date.now()) : "kürzlich";

  let images;

  if (pdf) {
    images = await pdf2Img(
      pdf,
      lastModified ? formatDateTime(lastModified) : "404 pdf not found",
      `${passedTime} aktualisiert`,
      `Turnus ${iteration}`
    );
  }

  let message = `Der Vertretungsplan wurde ${passedTime} aktualisiert. Alle fehlerhaften Daten bitte mit Screenshot des VPlans an Marcel weitergeben.\n\nVertretungsplan für ${formatLongDateTime(
    date
  )}. Der aktuelle Turnus ist ${iteration}.\n\n\`\`\`\n${getAsciiTimetable(
    day.timetable
  )}\n\`\`\``;

  if (!changes || error) {
    message = "Beim Verarbeiten des Vertretungsplans ist ein Fehler aufgetreten.\n\n**> ACHTUNG UNTEN IST DER NORMALE STUNDENPLAN <**\n\n" + message;
  }

  return await notify(message, images, telegram, discord);
}
