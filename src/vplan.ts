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
import {
  getActualTimetable,
  getAsciiTimetable,
  getDefaultTimetable,
  getTimetable,
} from "./timetable";
import Toucan from "toucan-js";

export async function vPlanCron(sentry: Toucan): Promise<unknown> {
  const date = new Date();

  let pdf: Blob | undefined;
  let changes: Changes | undefined;

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

  let lastModified: Date | null = null;

  try {
    const { lastModified: lm, modified } = await checkChangesAndUpdate();
    lastModified = lm;

    // vplan wasn't modified
    // between 15:00 and 15:14 UTC show timetable anyway
    if (!modified) {
      if (date.getUTCHours() !== 15) {
        return;
      }

      if (date.getUTCMinutes() > 14) {
        return;
      }
    }

    if (lm) {
      pdf = await fetchChangesPdf();
      if (pdf) {
        changes = await parseAndStoreChanges(sentry, pdf);
      }
    }
  } catch (e) {
    sentry.captureException(e);
    console.error(e);
  }

  const config: Config = JSON.parse(CONFIG);

  return await Promise.all(
    Object.entries(config).map(([name, data]) =>
      processClass(
        sentry,
        date,
        lastModified,
        iteration,
        pdf,
        changes,
        name,
        data.telegram,
        data.discord
      )
    )
  );
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
  const work = getTimetable(clazz)?.work;
  if (work) {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();

    const workingTime = work.find(({ start, end }) => {
      const [sYear, sMonth, sDay] = start;
      const [eYear, eMonth, eDay] = end;

      return (
        year >= sYear &&
        year <= eYear &&
        month >= sMonth &&
        month <= eMonth &&
        day >= sDay &&
        day <= eDay
      );
    });

    if (workingTime) {
      if (
        workingTime.start[0] === year &&
        workingTime.start[1] === month &&
        workingTime.start[2] === day
      ) {
        return await notify(
          `Ey du Idiot, geht nicht in die Schule! Du musst in deinen Betrieb, idk wo der ist. Am ${workingTime.end[2]}.${workingTime.end[1]}.${workingTime.end[0]} ist dein letzter Arbeitstag.`,
          undefined,
          telegram,
          discord
        );
      } else {
        return;
      }
    }
  }

  let day;
  let error = false;

  try {
    if (changes) day = await getActualTimetable(clazz, date, changes);
  } catch (e) {
    sentry.captureException(e);
    console.error(e);
    error = true;
  }

  if (!day) {
    day = { timetable: getDefaultTimetable(clazz, date, iteration) };
  }

  const passedTime = lastModified
    ? formatRelativeTime(lastModified.getTime() - Date.now())
    : "kürzlich";

  let images;

  if (pdf) {
    try {
      images = await pdf2Img(
        pdf,
        lastModified ? formatDateTime(lastModified) : "404 pdf not found",
        `${passedTime} aktualisiert`,
        `Turnus ${iteration}`
      );
    } catch (e) {
      sentry.captureException(e);
      console.error(e);
    }
  }

  let message = `\`\`\`\n${getAsciiTimetable(
    day.timetable
  )}\n\`\`\`\nDer Vertretungsplan wurde ${passedTime} aktualisiert.\nVertretungsplan für ${formatLongDateTime(
    date
  )}. Der aktuelle Turnus ist ${iteration}.\n\nAlle fehlerhaften Daten bitte an Klemens (IGD21) weitergeben.`;

  if (!changes || error) {
    message =
      "Ein Fehler ist aufgetreten.\n\n**> NORMALE STUNDENPLAN <**\n\n" +
      message;
  }

  return await notify(message, images, telegram, discord);
}
