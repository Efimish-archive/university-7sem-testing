import {
  type IAffectingClass,
  type AffectingClass,
  staticDependency,
} from "./affecting-class";

export class ClassUnderTest {
  private readonly iAff: IAffectingClass;

  constructor(pAff: IAffectingClass) {
    this.iAff = pAff;
  }

  publicMethod(arg: number): number {
    return this.privateMethod(arg);
  }

  protected protectedMethod(arg: number): number {
    if (arg !== 0) return this.iAff.val;
    throw new TypeError("arg is equal to zero");
  }

  private privateMethod(arg: number): number {
    return this.iAff.val > arg ? this.iAff.val : arg;
  }

  callStatic(): number {
    return staticDependency();
  }
}

export class ClassUnderTest2 {
  private readonly affInstance: AffectingClass;

  constructor(pAffInstance: AffectingClass) {
    this.affInstance = pAffInstance;
  }

  callAffectingMethod(): number {
    return this.affInstance.method();
  }
}
