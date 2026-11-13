export interface IAffectingClass {
  val: number;
  method(): number;
}

export class AffectingClass implements IAffectingClass {
  val = 0;

  method(): number {
    return 1;
  }
}

export function staticDependency(): number {
  return 2;
}
