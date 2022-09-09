import {
  Day,
  getBlock,
  getSubjects,
  Lesson,
  Subject,
  TimetableChange,
} from "../domain";

export function applyChanges(timetable: Day, changes: TimetableChange[]): void {
  for (const change of changes) {
    if (change.action !== "cancellation") {
      continue;
    }
    handleCancel(timetable, change);
  }

  // If the "add change" action is applied and a new lesson was added
  // the timetable has to be sorted, because the add change
  // adds the subjects at the end.
  let sort = false;

  for (const change of changes) {
    if (change.action === "cancellation") {
      continue;
    }
    if (handleChange(timetable, change)) {
      sort = true;
    }
  }

  if (sort) {
    timetable.sort((a, b) => a.time.start - b.time.start);
  }

  // botch: set lesson cancel to false for api
  timetable.forEach((lesson) => {
    if (!lesson.cancel) {
      lesson.cancel = false;
    }
  });
}

function handleCancel(timetable: Day, change: TimetableChange): void {
  const subjects = getSubjects(change.subject.from);

  let lesson: Lesson | undefined;
  subjects.every(
    (subject) => !(lesson = getLesson(timetable, change.lesson, subject))
  );

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

  if (lessons.length === 0) {
    throw new Error(
      `Change is outside the normal timetable: ${JSON.stringify(change)}`
    );
  }

  const subjectNames = getSubjects(change.subject.from).map(
    (subject) => subject.name
  );
  const lesson = lessons.find((lesson) =>
    subjectNames.includes(lesson.subject.name)
  );

  if (!lesson) {
    const expectedSubjects = JSON.stringify(
      lessons.map((lesson) => lesson.subject.name)
    );
    throw new Error(
      `Can not match subjects, expected: ${expectedSubjects}, actual: ${JSON.stringify(
        subjectNames
      )}`
    );
  }

  // botch: set lesson cancel to false for api
  lesson.cancel = false;

  switch (change.action) {
    case "replacement":
      lesson.subject = getSubjects(change.subject.to)[0];
      lesson.place = change.room.to;
      break;
    case "room-change":
      lesson.place = change.room.to;
      break;
    case "other":
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
  const canceledLesson = getLessons(timetable, change.lesson).find(
    (lesson) => lesson.cancel
  );

  if (canceledLesson) {
    canceledLesson.subject = getSubjects(change.subject.to)[0];
    canceledLesson.place = change.room.to;
    canceledLesson.cancel = false;
    applyMessage(canceledLesson, change.message);
    return false;
  }

  const newLesson = {
    subject: getSubjects(change.subject.to)[0],
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
  // currently there is no case where the same subjects with two groups is at the same time
  // if this would be the case I have also to check if the group is a match
  return timetable.find(
    (lesson) =>
      lesson.time.start === time && lesson.subject.name === subject.name
  );
}

function getLessons(timetable: Day, time: number): Lesson[] {
  return timetable.filter((lesson) => lesson.time.start === time);
}

function applyMessage(lesson: Lesson, message: string): void {
  if (message.length && message !== "Ausfall") {
    lesson.note = message;
  }
}
