import Feelings from "./Feelings";

export default class Activity {
  constructor(
    public title: string,
    public description: string,
    public feeling: Feelings,
    public time: number,
    public tags: string[],
    public user_id: Number,
    public id?: Number
  ) {}
}
