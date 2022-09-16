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
  work?: Worktime[];
}

export type Day = Lesson[];

export interface Worktime {
  start: [number, number, number]; // inclusive
  end: [number, number, number]; // inclusive
}

export interface Change<T> {
  from: T;
  to: T;
}

export type Action =
  | "cancellation"
  | "replacement"
  | "room-change"
  | "add"
  | "other";

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

export interface Config {
  IGD22: {
    telegram: number[];
    discord: string[];
  };
  IGD21: {
    telegram: number[];
    discord: string[];
  };
  IGD20: {
    telegram: number[];
    discord: string[];
  };
}

export const BLOCK_1: Time = { start: 1, duration: 2 };
export const BLOCK_2: Time = { start: 3, duration: 2 };
export const BLOCK_3: Time = { start: 5, duration: 2 };
export const BLOCK_4: Time = { start: 7, duration: 2 };
export const BLOCK_5: Time = { start: 9, duration: 2 };

export function getBlock(start: number): Time {
  switch (start) {
    case 1:
      return BLOCK_1;
    case 3:
      return BLOCK_2;
    case 5:
      return BLOCK_3;
    case 7:
      return BLOCK_4;
    case 9:
      return BLOCK_5;
    default:
      throw new Error(`Block with start time ${start} is not defined.`);
  }
}

export const W_R: Subject = { name: "W/R", aliases: ["wlr"] };
export const EN: Subject = { name: "En", aliases: ["eng"] };
export const EN_LK: Subject = { name: "En LK", aliases: ["lk-en", "lk-eng"] };
export const EN_GK: Subject = { name: "En GK", aliases: ["gk-en", "gk-eng"] };
export const MAFAK: Subject = { name: "Ma Fö", aliases: ["mafak"] };
export const MA: Subject = { name: "Ma" };
export const MA_LK: Subject = { name: "Ma LK", aliases: ["lk-ma"] };
export const MA_GK: Subject = { name: "Ma GK", aliases: ["gk-ma"] };
export const LF_1_2: Subject = { name: "LF 1+2", aliases: ["is-gp"] };
export const LF_3: Subject = { name: "LF 3" };
export const LF_4: Subject = { name: "LF 4" };
export const LF_5: Subject = { name: "LF 5", aliases: ["is"] };
export const LF_6: Subject = { name: "LF 6", aliases: ["info1", "info2"] };
export const LF_6_7_9: Subject = { name: "LF 6+7+9" };
export const LF_8: Subject = { name: "LF 8", aliases: ["lf8d_i1"] };
export const LF_9_12: Subject = { name: "LF 9+12" };
export const LF_10: Subject = { name: "LF 10" };
export const LF_11: Subject = { name: "LF 11" };
export const LF_13: Subject = { name: "LF 13" };
export const BK: Subject = { name: "BK", aliases: ["bk2"] };
export const BK_1: Subject = { name: "BK 1" };
export const BK_2: Subject = { name: "BK 2" };
// export const IS: Subject = { name: "IS", aliases: ["is1", "is2"] };
export const LIT: Subject = { name: "Lit" };
export const SP: Subject = { name: "Sp" };
export const GE: Subject = { name: "Ge", aliases: ["ggk"] };
export const ETH: Subject = { name: "Eth" };
export const FRZ: Subject = { name: "FRZ", aliases: ["frz b", "f-b"] };
export const RU: Subject = { name: "RU", aliases: ["ru b", "r-b"] };
export const D: Subject = { name: "D", aliases: ["de", "deu"] };
export const PH: Subject = { name: "Ph", aliases: ["phy"] };
export const CH: Subject = { name: "Ch" };

const SUBJECTS = [
  W_R,
  EN,
  EN_LK,
  EN_GK,
  MAFAK,
  MA,
  MA_LK,
  MA_GK,
  LF_1_2,
  LF_3,
  LF_4,
  LF_5,
  LF_6,
  LF_6_7_9,
  LF_8,
  LF_9_12,
  LF_10,
  LF_11,
  LF_13,
  BK,
  BK_1,
  BK_2,
  // IS,
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

export function getSubjects(value: string): Subject[] {
  const query = value.toLowerCase();

  const foundSubjects = SUBJECTS.filter((subject) =>
    subject.aliases?.includes(query)
  );
  const foundNameSubject = SUBJECTS.find(
    (subject) => subject.name.toLowerCase() === query
  );
  if (foundNameSubject) {
    foundSubjects.splice(0, 0, foundNameSubject);
    // return [foundNameSubject, ...foundSubjects];
  }

  if (foundSubjects.length === 0) {
    throw new Error(`Unable to find subject "${query}".`);
  }

  return foundSubjects;
}
