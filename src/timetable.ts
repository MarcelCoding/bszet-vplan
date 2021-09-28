enum Iteration {
  ALWAYS,
  WEEK1,
  WEEK2
}

enum Group {
  ALL,
  GROUP1,
  GROUP2
}

class Time {
  constructor(
      private readonly start0: number,
      private readonly end0: number
  ) {}

  static fromBlock(block: number): Time {
    return new Time(block * 2 - 1, block * 2);
  }

  public get start() { return this.start0; }
  public get end() { return this.end0; }
}

class ScheduledSubject {
    constructor(
        private readonly name0: string,
        private readonly room0: string,
        private readonly time0: Time,
        private readonly iteration0: Iteration,
        private readonly group0: Group = Group.ALL
    ) {}

    public get name() { return this.name0; }
    public get room() { return this.room0; }
    public get time() { return this.time0; }
    public get iteration() { return this.iteration0; }
    public get group() { return this.group0; }
}



export const data = {
  mon: [
      new ScheduledSubject("W/R", "B 8", Time.fromBlock(2), Iteration.ALWAYS),
      new ScheduledSubject("En", "B 12", Time.fromBlock(3), Iteration.WEEK1),
      new ScheduledSubject("Ma", "B 10", Time.fromBlock(3), Iteration.WEEK2),
      new ScheduledSubject("LF 6", "B 411", Time.fromBlock(4), Iteration.ALWAYS, Group.GROUP1),
      new ScheduledSubject("IS", "B 3", Time.fromBlock(4), Iteration.ALWAYS, Group.GROUP2),
      new ScheduledSubject("BK 1", "A 06", Time.fromBlock(5), Iteration.WEEK2),
      new ScheduledSubject("Lit", "B 4", Time.fromBlock(5), Iteration.WEEK2)
  ],
  tue: [
      new ScheduledSubject("Ma", "B 12", Time.fromBlock(1), Iteration.ALWAYS),
      new ScheduledSubject("En", "B 204", Time.fromBlock(2), Iteration.ALWAYS),
      new ScheduledSubject("LF 1+2", "B 03", Time.fromBlock(3), Iteration.ALWAYS),
      new ScheduledSubject("BK 2", "A 06", Time.fromBlock(4), Iteration.WEEK1),
      new ScheduledSubject("Sp", "Kästner", Time.fromBlock(4), Iteration.WEEK2)
  ],
  wed: [
      new ScheduledSubject("Ge", "B 108", Time.fromBlock(1), Iteration.ALWAYS),
      new ScheduledSubject("IS", "B 3", Time.fromBlock(2), Iteration.ALWAYS),
      new ScheduledSubject("Eth", "B 306", Time.fromBlock(3), Iteration.WEEK1),
      new ScheduledSubject("LF 5", "B 405", Time.fromBlock(3), Iteration.WEEK2),
      new ScheduledSubject("Frz", "A 102", Time.fromBlock(4), Iteration.ALWAYS),
      new ScheduledSubject("Ru", "B 4", Time.fromBlock(4), Iteration.ALWAYS)
  ],
  thu: [
      new ScheduledSubject("D", "B 6", Time.fromBlock(1), Iteration.ALWAYS),
      new ScheduledSubject("Ma", "B 10", Time.fromBlock(2), Iteration.ALWAYS),
      new ScheduledSubject("IS", "B 3", Time.fromBlock(3), Iteration.ALWAYS),
      new ScheduledSubject("Ph", "B 112", Time.fromBlock(4), Iteration.ALWAYS)
  ],
  fri: [
      new ScheduledSubject("LF 6", "B 441", Time.fromBlock(1), Iteration.ALWAYS, Group.GROUP2),
      new ScheduledSubject("IS", "B 312", Time.fromBlock(1), Iteration.ALWAYS, Group.GROUP1),
      new ScheduledSubject("Ch", "B 9", Time.fromBlock(2), Iteration.ALWAYS),
      new ScheduledSubject("D", "B 6", Time.fromBlock(3), Iteration.ALWAYS),
      new ScheduledSubject("Frz", "A 102", Time.fromBlock(4), Iteration.ALWAYS),
      new ScheduledSubject("Ru", "B 4", Time.fromBlock(4), Iteration.ALWAYS)
  ]
}
