import {
  Day,
  getBlock,
  getSubject,
  Lesson,
  Subject,
  TimetableChange,
} from "../domain";

export function applyChanges(timetable: Day, changes: TimetableChange[]): void {
  changes.forEach((change) => {
    if (change.action !== "cancellation") {
      return;
    }
    handleCancel(timetable, change);
  });

  // If the "add change" action is applied and a new lesson was added
  // the timetable has to be sorted, because the add change
  // adds the subjects at the end.
  let sort = false;

  changes.forEach((change) => {
    if (change.action === "cancellation") {
      return;
    }
    if (handleChange(timetable, change)) {
      sort = true;
    }
  });

  if (sort) {
    timetable.sort((a, b) => b.time.start - a.time.start);
  }
  
  // botch: set lesson cancel to false for api
  timetable.forearch(lesson => {
    if(!lesson.cancel) {
      lesson.cancel = false;
    }
  });
}

function handleCancel(timetable: Day, change: TimetableChange): void {
  const subject = getSubject(change.subject.from);
  const lesson = getLesson(timetable, change.lesson, subject);

  if (!lesson) {
    throw new Error(
      `Cancel is outside the normal timetable: ${JSON.stringify(change)}`
    );
  }

  lesson.cancel = true;
  applyMessage(lesson, change.message);
}

/**
 * @return if the timetable has to be sorted
 */
function handleChange(timetable: Day, change: TimetableChange): boolean {
  if (change.action === "add") {
    return handleAdd(timetable, change);
  }

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

  switch (change.action) {
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

  applyMessage(lesson, change.message);
  return false;
}

/**
 * @return if the timetable has to be sorted
 */
function handleAdd(timetable: Day, change: TimetableChange): boolean {
  const subject = getSubject(change.subject.from);
  const lesson = getLesson(timetable, change.lesson, subject);

  if (lesson?.cancel) {
    lesson.subject = getSubject(change.subject.to);
    lesson.place = change.room.to;
    applyMessage(lesson, change.message);
    return false;
  }

  const newLesson = {
    subject: getSubject(change.subject.to),
    place: change.room.to,
    time: getBlock(change.lesson),
    cancel: false,
  };

  applyMessage(newLesson, change.message);
  timetable.push(newLesson);

  return true;
}

function getLesson(
  timetable: Day,
  time: number,
  subject: Subject
): Lesson | undefined {
  // currently there is no case where the same subjects with tow groups is at the same time
  // if this would be the case I have also to check if the group is a match
  return timetable.find(
    (lesson) =>
      lesson.time.start === time && lesson.subject.name == subject.name
  );
}

function applyMessage(lesson: Lesson, message: string): void {
  if (message.length && message !== "Ausfall") {
    lesson.note = message;
  }
}
