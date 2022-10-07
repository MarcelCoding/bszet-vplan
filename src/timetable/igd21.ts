import {
  BK,
  BLOCK_1,
  BLOCK_2,
  BLOCK_3,
  BLOCK_4,
  BLOCK_5,
  CH,
  D,
  EN_GK,
  EN_LK,
  ETH,
  FRZ,
  GE,
  LF_10,
  LF_11,
  LF_6_7_9,
  LF_8,
  LIT,
  MA_GK,
  MA_LK,
  PH,
  RU,
  SP,
  Timetable,
} from "../domain";

export const IGD21: Timetable = {
  // https://geschuetzt.bszet.de/s-lk-vw/Stundenplaene/DuBAS/IGD%2021.pdf
  mon: [
    { time: BLOCK_1, subject: MA_GK, place: "B10" },
    { time: BLOCK_2, subject: LF_6_7_9, place: "B8" },
    { time: BLOCK_3, iteration: 1, subject: GE, place: "B4" },
    { time: BLOCK_3, iteration: 2, subject: EN_LK, place: "B03" },
    { time: BLOCK_3, iteration: 2, subject: MA_LK, place: "B11" },
    { time: BLOCK_4, subject: LF_11, place: "B5", group: 1 },
    { time: BLOCK_4, subject: LF_8, place: "B405", group: 2 },
    { time: BLOCK_5, iteration: 1, subject: EN_GK, place: "B03" },
    { time: BLOCK_5, iteration: 2, subject: BK, place: "A06" },
  ],
  tue: [
    { time: BLOCK_1, subject: LF_6_7_9, place: "B8" },
    { time: BLOCK_2, subject: D, place: "B6" },
    { time: BLOCK_3, subject: GE, place: "B8" },
    { time: BLOCK_4, subject: ETH, place: "B112" },
  ],
  wed: [
    { time: BLOCK_1, subject: FRZ, place: "A102" },
    { time: BLOCK_1, subject: RU, place: "B4" },
    { time: BLOCK_2, subject: CH, place: "B9" },
    { time: BLOCK_3, subject: D, place: "B6" },
    { time: BLOCK_4, subject: EN_LK, place: "B03" },
    { time: BLOCK_4, subject: MA_LK, place: "B11" },
    { time: BLOCK_5, iteration: 2, subject: LIT, place: "B4" },
  ],
  thu: [
    { time: BLOCK_1, subject: PH, place: "B106" },
    { time: BLOCK_2, subject: LF_8, place: "B5", group: 1 },
    { time: BLOCK_2, subject: LF_11, place: "B405", group: 2 },
    { time: BLOCK_3, subject: EN_GK, place: "B05" },
    { time: BLOCK_3, subject: MA_GK, place: "B11" },
    { time: BLOCK_4, subject: SP, place: "117.GS" },
  ],
  fri: [
    { time: BLOCK_1, subject: LF_10, place: "B405", group: 1 },
    { time: BLOCK_2, subject: FRZ, place: "A102" },
    { time: BLOCK_2, subject: RU, place: "B4" },
    { time: BLOCK_3, subject: EN_LK, place: "B6" },
    { time: BLOCK_3, subject: MA_LK, place: "B11" },
    { time: BLOCK_4, iteration: 1, subject: LF_11, place: "B5", group: 1 },
    { time: BLOCK_4, iteration: 1, subject: LF_8, place: "B3", group: 2 },
    { time: BLOCK_4, iteration: 2, subject: LF_8, place: "B3", group: 1 },
    { time: BLOCK_4, iteration: 2, subject: LF_11, place: "B5", group: 2 },
  ],
  work: [
    // https://frei.bszet.de/inhalt/Blockplaene/DuBAS/Sonderblockplan%20DuBAS-I%20-%20IGD%2021%20Schuljahr%202022-2023.pdf
    { start: [2022, 9, 12], end: [2022, 9, 23] },
    { start: [2022, 10, 17], end: [2022, 10, 28] },
    { start: [2022, 12, 5], end: [2023, 1, 2] },
    { start: [2023, 2, 6], end: [2023, 3, 3] },
    { start: [2023, 4, 3], end: [2023, 4, 28] },
    { start: [2023, 5, 19], end: [2023, 5, 19] },
    { start: [2023, 6, 5], end: [2023, 6, 16] },
    { start: [2023, 7, 10], end: [2023, 8, 18] }, // holidays
  ],
};
