export enum DaysOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

export enum Genders{
  male,
  female
}

export class ShardEnums
{
  public static getEnumOptions<T extends object>(e: T): { text: string; value: number }[] {
  return Object.keys(e)
    .filter(k => isNaN(Number(k))) // keep only enum names
    .map(k => ({
      text: k,
      value: (e as unknown)[k] as number
    }));
}

 public static getEnumstring<T extends object>(e: T): { text: string; value: string }[] {
  return Object.keys(e)
     .filter(k => isNaN(Number(k)))
    .map(k => ({
      text: k,
      value: k
    }));
}
}
