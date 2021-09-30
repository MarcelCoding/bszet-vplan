import {
  BK,
  BlOCK_1,
  BlOCK_2,
  BlOCK_3,
  BlOCK_4,
  BlOCK_5,
  CH,
  D,
  EN_LK,
  EN_GK,
  ETH,
  FRZ,
  GE,
  LF_6,
  LF_6_7_9,
  LF_8,
  LF_10,
  LF_11,
  LIT,
  MA_LK,
  MA_GK,
  PH,
  room,
  RU,
  SP,
  Timetable,
} from "../domain";
  
export const IGD20: Timetable = {
  mon: [
    { time: BlOCK_1, subject: LF_10, place: room("D", 111), group: 1, iteration: 2 },
    { time: BlOCK_1, subject: LF_10, place: room("B", 405), group: 2 , iteration: 2 },
    { time: BlOCK_2, subject: D, place: room("B", 4) },
    { time: BlOCK_3, subject: RU, place: room("B", 4) },
    { time: BlOCK_3, subject: FRZ, place: room("A", 102) },
    { time: BlOCK_4, subject: MA_LK, place: room("B", 10), iteration: 1 },
    { time: BlOCK_4, subject: EN_LK, place: room("B", "03"), iteration: 1 },
    { time: BlOCK_4, subject: GE, place: room("B", 414), iteration: 2 },
    { time: BlOCK_5, subject: BK, place: room("A", "06"), iteration: 1 },
    { time: BlOCK_5, subject: LIT, place: room("B", 4), iteration: 1 },
  ],
  tue: [
    { time: BlOCK_1, subject: MA_GK, place: room("B", 11) },
    { time: BlOCK_1, subject: EN_GK, place: room("B", "03"), iteration: 1 },
    { time: BlOCK_2, subject: MA_LK, place: room("B", 306) },
    { time: BlOCK_2, subject: EN_LK, place: room("B", "03") },
    { time: BlOCK_3, subject: LF_8, place: room("A", 303), iteration: 1, group: 1 },
    { time: BlOCK_3, subject: LF_11, place: room("A", 203), iteration: 1, group: 2 },
    { time: BlOCK_3, subject: LF_11, place: room("A", 203), iteration: 2, group: 1 },
    { time: BlOCK_3, subject: LF_8, place: room("A", 303), iteration: 2, group: 2 },
    { time: BlOCK_4, subject: LF_8, place: room("A", 303), group: 1 },
    { time: BlOCK_4, subject: LF_11, place: room("A", 203),  group: 2 },
  ],
  wed: [
    { time: BlOCK_1, subject: LF_6_7_9, place: room("B", 12) },
    { time: BlOCK_2, subject: ETH, place: room("B", 306), iteration: 1 },
    { time: BlOCK_2, subject: LF_6, place: room("B", 411), iteration: 2 },
    { time: BlOCK_3, subject: LF_6_7_9, place: room("B", 8), iteration: 1 },
    { time: BlOCK_3, subject: ETH, place: room("B", 306), iteration: 2 },
    { time: BlOCK_4, subject: SP, place: "Kästner" },
  ],
  thu: [
    { time: BlOCK_1, subject: MA_LK, place: room("B", 10) },
    { time: BlOCK_1, subject: EN_LK, place: room("B", "03") },
    { time: BlOCK_2, subject: D, place: room("B", 6) },
    { time: BlOCK_3, subject: MA_GK, place: room("B", 10) },
    { time: BlOCK_3, subject: EN_GK, place: room("B", "03") },
    { time: BlOCK_4, subject: CH, place: room("B", 9) },
  ],
  fri: [
    { time: BlOCK_1, subject: PH, place: room("B", 114) },
    { time: BlOCK_2, subject: RU, place: room("B", 8) },
    { time: BlOCK_2, subject: FRZ, place: room("A", 102) },
    { time: BlOCK_3, subject: LF_11, place: room("A", 203), group: 1 },
    { time: BlOCK_3, subject: LF_8, place: room("A", 302), group: 2 },
    { time: BlOCK_4, subject: GE, place: room("B", 414) },
  ],
};
  