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

export type Action = "cancellation" | "replacement" | "room-change" | "add";

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

export function getBlock(start: number) {
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
export const MA: Subject = { name: "Ma" };
export const BK_1: Subject = { name: "BK 1" };
export const BK_2: Subject = { name: "BK 2" };
export const IS: Subject = { name: "IS" };
export const LIT: Subject = { name: "Lit" };
export const SP: Subject = { name: "Sp" };
export const GE: Subject = { name: "Ge", aliases: ["ggk"] };
export const ETH: Subject = { name: "Eth" };
export const FRZ: Subject = { name: "FRZ", aliases: ["frz b", "f-b"] };
export const RU: Subject = { name: "RU", aliases: ["ru b", "r-b"] };
export const D: Subject = { name: "D", aliases: ["de", "deu"] };
export const CH_1: Subject = { name: "CH 1" };
export const CH_2 : Subject = { name: "CH 2" };
export const INFO : Subject = { name: "Info" };
export const Bio_2 : Subject = { name: "Bio 2" };
export const Bio_1 : Subject = { name: "Bio 1" };
export const PH_1 : Subject = { name: "Ph 1", aliases: ["phy 1"] };
export const PH_2 : Subject = { name: "Ph 2", aliases: ["phy 2"] };
export const INFO_1 : Subject = { name: "Info 1" };
export const INFO_2 : Subject = { name: "Info 2" };
export const REL : Subject = { name: "Rel" };
export const F_EN: Subject = {name: "F-En" };
const subjects = [
  CH_1,
  CH_2,
  Bio_1,
  Bio_2,
  PH_1,
  PH_2,
  W_R,
  INFO,
  BK_1,
  BK_2,
  INFO_1,
  INFO_2,
  REL,
  D,
  EN,
  ETH,
  FRZ,
  GE,
  LIT,
  MA,
  RU,
  SP,
  IS,
  F_EN,
];

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
