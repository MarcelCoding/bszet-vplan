import { Day, getSubject, Lesson, TimetableChange } from "../domain";

const CHANGES_URL =
  "https://geschuetzt.bszet.de/s-lk-vw/Vertretungsplaene/vertretungsplan-bgy.pdf";
const PARSE_CHANGES_URL = "https://pdf2img.schripke.xyz/parse-pdf";

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
      lesson.place = change.subject.to;
      break;
    case "room-change":
      lesson.place = change.subject.to;
      break;
  }
}

export async function fetchChanges(): Promise<{
  data: TimetableChange[];
  failures: unknown[];
}> {
  const bszResponse = await fetch(CHANGES_URL, {
    // @ts-ignore
    headers: { Authorization: "Basic " + btoa(USER + ":" + PASS) },
  });

  if (bszResponse.status !== 200) {
    throw new Error(
      `Unable to fetch vplan: ${bszResponse.status} ${bszResponse.statusText}`
    );
  }

  const data = new FormData();
  data.append("file", new Blob([await bszResponse.arrayBuffer()]));

  const changesResponse = await fetch(PARSE_CHANGES_URL, {
    method: "POST",
    body: data,
    // @ts-ignore
    headers: { Authorization: `Bearer ${API_KEY}` },
  });

  if (changesResponse.status !== 200) {
    throw new Error(
      `Unable to parse changes: ${bszResponse.status} ${bszResponse.statusText}`
    );
  }

  return changesResponse.json();
}
