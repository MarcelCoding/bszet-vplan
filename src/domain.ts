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

export type Building = "A" | "B" | "Kästner";

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
  place: Place;
  group?: Group;
}

export interface Timetable {
  mon: Lesson[];
  tue: Lesson[];
  wed: Lesson[];
  thu: Lesson[];
  fri: Lesson[];
}

export const BlOCK_1: Time = { start: 0, duration: 2 };
export const BlOCK_2: Time = { start: 2, duration: 2 };
export const BlOCK_3: Time = { start: 4, duration: 2 };
export const BlOCK_4: Time = { start: 6, duration: 2 };
export const BlOCK_5: Time = { start: 8, duration: 2 };

export const W_R: Subject = { name: "W/R" };
export const EN: Subject = { name: "En" };
export const MA: Subject = { name: "Ma" };
export const LF_1_2: Subject = { name: "LF 1+2" };
export const LF_5: Subject = { name: "LF 5" };
export const LF_6: Subject = { name: "LF 6" };
export const BK_1: Subject = { name: "BK 1" };
export const BK_2: Subject = { name: "BK 2" };
export const IS: Subject = { name: "IS" };
export const LIT: Subject = { name: "Lit" };
export const SP: Subject = { name: "Sp" };
export const GE: Subject = { name: "Ge" };
export const ETH: Subject = { name: "Eth" };
export const FRZ: Subject = { name: "FRZ", aliases: ["F-B"] };
export const RU: Subject = { name: "RU" };
export const D: Subject = { name: "D" };
export const PH: Subject = { name: "Ph" };
export const CH: Subject = { name: "Ch" };

export function room(building: Building, number: number | string): Room {
  return { building, number };
}
