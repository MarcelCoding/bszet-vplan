import {
  Changes,
  Day,
  Iteration,
  Lesson,
  Timetable,
  TimetableChange,
} from "../domain";
import { applyChanges } from "./changes";
import { applyIteration, getIteration } from "../iteration";
import { IGD21 } from "./igd21";
import { IGD20 } from "./igd20";
import { getBorderCharacters, table } from "table";

const tableBorderCharacters = getBorderCharacters("void");

export function getAsciiTimetable(timetable: Day): string {
  const hasNote = Boolean(timetable.find((x) => x.note));

  return (
    table(
      timetable.map((lesson) => formatLesson(lesson, hasNote)),
      { border: tableBorderCharacters }
    )
      // workaround to remove space on front and behind table (issue #17)
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length !== 0)
      .join("\n")
  );
}

function formatLesson(lesson: Lesson, note: boolean): unknown[] {
  const room =
    typeof lesson.place === "object"
      ? `${lesson.place.building} ${lesson.place.number}`
      : lesson.place;

  const data = [
    lesson.time.start + ".",
    lesson.cancel
      ? `Ausfall (${formatSubject(lesson)})`
      : formatSubject(lesson),
    room,
  ];

  if (note) {
    data.push(lesson.note || "");
  }

  return data;
}

function formatSubject(lesson: Lesson): string {
  return lesson.group
    ? lesson.subject.name + ", Gr. " + lesson.group
    : lesson.subject.name;
}

export function getDefaultTimetable(clazz: string, date: Date) {
  const fullTimetable = getTimetable(clazz);
  if (!fullTimetable) {
    throw new Error(`Class "${clazz}" not found.`);
  }

  return getDay(fullTimetable, date);
}

export async function getActualTimetable(
  clazz: string,
  date: Date,
  changesResponse: Changes
): Promise<{
  timetable: Day;
  changes: TimetableChange[];
  iteration: Iteration;
}> {
  const isoDate = date.toISOString().substring(0, 10);

  const timetable = getDefaultTimetable(clazz, date);

  const changes = changesResponse.data.filter(
    (change) => change.classes.includes(clazz) && change.date === isoDate
  );

  const iteration = getIteration(date);
  if (!iteration) {
    throw new Error("Unable to gather iteration.");
  }

  const clone: Day = applyIteration(
    iteration,
    JSON.parse(JSON.stringify(timetable))
  );

  applyChanges(clone, changes);

  return { timetable: clone, changes, iteration };
}

function getTimetable(clazz: string): Timetable | null {
  switch (clazz.toUpperCase()) {
    case "IGD21":
      return IGD21;
    case "IGD20":
      return IGD20;
    default:
      return null;
  }
}

function getDay(timetable: Timetable, date: Date): Day {
  // 0 = sunday
  const day = date.getUTCDay();

  switch (day) {
    case 1:
      return timetable.mon;
    case 2:
      return timetable.tue;
    case 3:
      return timetable.wed;
    case 4:
      return timetable.thu;
    case 5:
      return timetable.fri;
    default:
      throw new Error(`Invalid day "${day}", expected 1-5`);
  }
}
