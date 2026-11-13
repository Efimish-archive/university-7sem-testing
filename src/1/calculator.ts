export class CalculatorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class Calculator {
  private value: number;

  constructor(initialValue: number = 0) {
    this.value = initialValue;
  }

  /**
   * Returns the current computed value.
   */
  public get result(): number {
    return this.value;
  }

  /**
   * Resets the calculator result back to a specific value or zero.
   */
  public clear(value: number = 0): this {
    this.value = value;
    return this;
  }

  /**
   * Adds a number to the running total.
   */
  public add(value: number): this {
    this.value += value;
    return this;
  }

  /**
   * Subtracts a number from the running total.
   */
  public subtract(value: number): this {
    this.value -= value;
    return this;
  }

  /**
   * Multiplies the running total by a number.
   */
  public multiply(value: number): this {
    this.value *= value;
    return this;
  }

  /**
   * Divides the running total by a number.
   * @throws {Error} If attempting to divide by zero.
   */
  public divide(value: number): this {
    if (value === 0) {
      throw new CalculatorError("Division by zero is not allowed.");
    }
    this.value /= value;
    return this;
  }
}
