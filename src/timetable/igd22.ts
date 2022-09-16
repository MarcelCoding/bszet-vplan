import {
  BK_1,
  BK_2,
  BLOCK_1,
  BLOCK_2,
  BLOCK_3,
  BLOCK_4,
  BLOCK_5,
  CH,
  D,
  EN,
  ETH,
  FRZ,
  GE,
  LF_1_2,
  LF_3,
  LF_4,
  LF_5,
  LF_6,
  LIT,
  MA,
  PH,
  RU,
  SP,
  Timetable,
  W_R,
} from "../domain";

export const IGD22: Timetable = {
  // https://geschuetzt.bszet.de/s-lk-vw/Stundenplaene/DuBAS/IGD%2022.pdf
  mon: [
    { time: BLOCK_1, subject: FRZ, place: "A 102" },
    { time: BLOCK_1, subject: RU, place: "B 4" },
    { time: BLOCK_2, subject: LF_3, place: "B 3" },
    { time: BLOCK_3, subject: LF_5, place: "B 3" },
    { time: BLOCK_4, subject: MA, place: "B 112" },
  ],
  tue: [
    { time: BLOCK_2, subject: W_R, place: "B 8" },
    { time: BLOCK_3, iteration: 1, subject: ETH, place: "B 4" },
    { time: BLOCK_3, iteration: 2, subject: LF_6, place: "B 4" },
    { time: BLOCK_4, subject: CH, place: "B 9" },
    { time: BLOCK_5, iteration: 1, subject: BK_1, place: "A 06" },
    { time: BLOCK_5, iteration: 2, subject: BK_2, place: "A 06" },
  ],
  wed: [
    { time: BLOCK_1, iteration: 1, subject: EN, place: "B 05" },
    { time: BLOCK_1, iteration: 2, subject: MA, place: "B 11" },
    { time: BLOCK_2, subject: D, place: "B 6" },
    { time: BLOCK_3, subject: LF_1_2, place: "B 8" },
    { time: BLOCK_4, subject: SP, place: "Zinzendorfstr." },
    { time: BLOCK_5, iteration: 2, subject: LIT, place: "D 017" },
  ],
  thu: [
    { time: BLOCK_1, subject: FRZ, place: "A 102" },
    { time: BLOCK_1, subject: RU, place: "B 4" },
    { time: BLOCK_2, subject: EN, place: "B 110" },
    { time: BLOCK_3, subject: LF_4, place: "B 5", group: 1 },
    { time: BLOCK_3, subject: LF_6, place: "B 411", group: 2 },
    { time: BLOCK_4, subject: LF_4, place: "B 5", group: 2 },
    { time: BLOCK_4, subject: LF_6, place: "B 411", group: 1 },
  ],
  fri: [
    { time: BLOCK_1, subject: D, place: "B 6" },
    { time: BLOCK_2, subject: MA, place: "B 112" },
    { time: BLOCK_3, subject: PH, place: "B 112" },
    { time: BLOCK_4, subject: GE, place: "B 8" },
  ],
  work: [
    // https://frei.bszet.de/inhalt/Blockplaene/DuBAS/Sonderblockplan%20DuBAS-I%20-%20IGD%2022%20Schuljahr%202022-2023.pdf
    { start: [2022, 10, 17], end: [2022, 10, 28] }, // holidays
    { start: [2022, 11, 1], end: [2022, 11, 11] }, // internship
    { start: [2022, 12, 22], end: [2023, 1, 2] }, // holidays
    { start: [2023, 2, 13], end: [2023, 2, 24] }, // holidays
    { start: [2023, 4, 6], end: [2023, 4, 14] }, // holidays
    { start: [2023, 4, 17], end: [2023, 4, 28] }, // internship
    { start: [2023, 5, 18], end: [2023, 5, 29] }, // holidays
  ],
};
