import { Day, Timetable, TimetableChange } from "../domain";
import { applyChanges, fetchChanges } from "./changes";
import { applyIteration, getIteration } from "../iteration";
import { IGD21 } from "./igd21";

export async function getActualTimetable(
  clazz: string,
  date: Date
): Promise<{ timetable: Day; changes: TimetableChange[] }> {
  const isoDate = date.toISOString().substring(0, 10);

  const orgTimetable = getTimetable(clazz);
  if (!orgTimetable) {
    throw new Error(`Class "${clazz}" not found`);
  }

  const timetable = getDay(orgTimetable, date);

  const changesResponse = await fetchChanges();
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

  return { timetable: clone, changes };
}

function getTimetable(clazz: string): Timetable | null {
  switch (clazz) {
    case "IGD21":
      return IGD21;
    default:
      return null;
  }
}

function getDay(timetable: Timetable, date: Date): Day {
  // 0 = sunday
  const day = date.getDay();

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
