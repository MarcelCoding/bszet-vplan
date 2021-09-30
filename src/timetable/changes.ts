import { Day, getSubject, Lesson, TimetableChange } from "../domain";

export function applyChanges(timetable: Day, changes: TimetableChange[]): void {
  changes.forEach((change) => applyChange(timetable, change));
}

function applyChange(timetable: Day, change: TimetableChange) {
  const lessons = timetable.filter(
    (lesson) => lesson.time.start === change.lesson
  );

  if (lessons.length == 0) {
    throw new Error(
      `Change is outside the normal timetable: ${JSON.stringify(change)}`
    );
  }

  const subject = getSubject(change.subject.from).name;
  const lesson = lessons.find((lesson) => lesson.subject.name === subject);

  if (!lesson) {
    const expectedSubjects = JSON.stringify(
      lessons.map((lesson) => lesson.subject.name)
    );
    throw new Error(
      `Can not match subjects, expected: ${expectedSubjects}, actual: ${subject}`
    );
  }

  applyChange0(lesson, change);
}

function applyChange0(lesson: Lesson, change: TimetableChange) {
  switch (change.action) {
    case "cancellation":
      lesson.cancel = true;
      break;
    case "replacement":
      lesson.subject = getSubject(change.subject.to);
      lesson.place = change.room.to;
      break;
    case "room-change":
      lesson.place = change.room.to;
      break;
    default:
      throw new Error(
        `Timetable change action "${change.action}" not implemented.`
      );
  }

  if (change.message !== "Ausfall") {
    lesson.note = change.message;
  }
}
