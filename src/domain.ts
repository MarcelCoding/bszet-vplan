export interface Time {
  start: number;
  duration: number;
}

export type Iteration = 1 | 2;

export interface Teacher {
  name: string;
  aliases?: string[];
}

export interface Subject {
  name: string;
  teacher?: Teacher;
  aliases?: string[];
}

export type Building = "A" | "B" | "D" | "Kästner";

export interface Room {
  building: Building;
  number: number | string;
}

export type Place = Building | Room;

export type Group = 1 | 2;

export interface Lesson {
  time: Time;
  iteration?: Iteration;
  subject: Subject;
  place: Place /* vplan changes -> */ | string;
  group?: Group;
  cancel?: boolean;
  note?: string;
}

export interface Timetable {
  mon: Day;
  tue: Day;
  wed: Day;
  thu: Day;
  fri: Day;
}

export type Day = Lesson[];

export interface Change<T> {
  from: T;
  to: T;
}

export type Action = "cancellation" | "replacement" | "room-change";

export interface TimetableChange {
  classes: string[];
  subject: Change<string>;
  room: Change<string>;
  date: string;
  lesson: number;
  message: string;
  action: Action;
  guessedAction: boolean;
}

export interface Changes {
  data: TimetableChange[];
  failures: unknown[];
}

export const BlOCK_1: Time = { start: 1, duration: 2 };
export const BlOCK_2: Time = { start: 3, duration: 2 };
export const BlOCK_3: Time = { start: 5, duration: 2 };
export const BlOCK_4: Time = { start: 7, duration: 2 };
export const BlOCK_5: Time = { start: 9, duration: 2 };

export const W_R: Subject = { name: "W/R" };
export const EN: Subject = { name: "En" };
export const EN_LK: Subject = { name: "En LK" };
export const EN_GK: Subject = { name: "En GK" };
export const MA: Subject = { name: "Ma" };
export const MA_LK: Subject = { name: "Ma LK" };
export const MA_GK: Subject = { name: "Ma GK" };
export const LF_1_2: Subject = { name: "LF 1+2" };
export const LF_5: Subject = { name: "LF 5" };
export const LF_6: Subject = { name: "LF 6" };
export const LF_6_7_9: Subject = { name: "LF 6+7+9" };
export const LF_8: Subject = { name: "LF 8" };
export const LF_10: Subject = { name: "LF 10" };
export const LF_11: Subject = { name: "LF 11" };
export const BK: Subject = { name: "BK" };
export const BK_1: Subject = { name: "BK 1" };
export const BK_2: Subject = { name: "BK 2" };
export const IS: Subject = { name: "IS" };
export const LIT: Subject = { name: "Lit" };
export const SP: Subject = { name: "Sp" };
export const GE: Subject = { name: "Ge" };
export const ETH: Subject = { name: "Eth" };
export const FRZ: Subject = { name: "FRZ", aliases: ["frz b", "f-b"] };
export const RU: Subject = { name: "RU", aliases: ["ru b", "r-b"] };
export const D: Subject = { name: "D", aliases: ["de", "deu"] };
export const PH: Subject = { name: "Ph", aliases: ["phy"] };
export const CH: Subject = { name: "Ch" };

const subjects = [
  W_R,
  EN,
  EN_LK,
  EN_GK,
  MA,
  MA_LK,
  MA_GK,
  LF_1_2,
  LF_5,
  LF_6,
  LF_6_7_9,
  LF_8,
  LF_10,
  LF_11,
  BK,
  BK_1,
  BK_2,
  IS,
  LIT,
  SP,
  GE,
  ETH,
  FRZ,
  RU,
  D,
  PH,
  CH,
];

export function room(building: Building, number: number | string): Room {
  return { building, number };
}

export function getSubject(value: string): Subject {
  const query = value.toLowerCase();

  const subject = subjects.find(
    (subject) =>
      subject.name.toLowerCase() === query || subject.aliases?.includes(query)
  );

  if (!subject) {
    throw new Error(`Unable to find subject "${query}".`);
  }

  return subject;
}
