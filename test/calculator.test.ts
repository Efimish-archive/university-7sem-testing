import {
  describe,
  test,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  expect,
} from "vitest";
import { Calculator, CalculatorError } from "../src/calculator";

describe("Suite", () => {
  let calc: Calculator;
  let counter: number;
  let successful: number;

  beforeAll(() => {
    calc = new Calculator();
    counter = 0;
    successful = 0;
    console.log("Тесты начались...");
  });

  beforeEach((ctx) => {
    calc.clear();
    counter += 1;
    console.log(`Начался тест #${counter}: «${ctx.task?.name}»...`);
  });

  test("Assert.AreEqual", () => {
    expect(calc.add(5).result).toEqual(5);
  });

  test("Assert.AreSame", () => {
    expect(calc.add(4).multiply(3).result).toBe(12);
    expect(calc.subtract(2).result).toBe(10);
    expect(calc.divide(2).result).toBe(5);
  });

  test("Assert.IsTrue", () => {
    expect(calc.add(1)).toBeTruthy();
  });

  test("Assert.IsNull", () => {
    expect(null).toBeNull();
  });

  test("Assert.InstanceOfType", () => {
    expect(calc).toBeInstanceOf(Calculator);
  });

  test("Assert.ThrowsException<T>", () => {
    expect(() => {
      calc.divide(0).result
    }).toThrow(CalculatorError);
  });

  test.each([
    [2, 3, 5],
    [1, 0, 1],
    [4, 5, 9],
  ])("%i + %i == %i", (a, b, expected) => {
    expect(calc.add(a).add(b).result).toBe(expected);
  });

  afterEach((ctx) => {
    if (ctx.task?.result?.state === "pass") successful += 1;
    console.log(`Закончен тест #${counter}: «${ctx.task?.name}»!`);
  });

  afterAll(() => {
    console.log("Тесты закончились!");
    console.log(`Успешно: ${successful}/${counter}`);
  });
});

// MSTest  <== VS ==>  Vitest
// Атрибуты:
// TestClass      === describe()
// TestMethod     === test()
// DataRow        === test.each()
// DataTestMethod === test.each()
// TestInitialize === beforeEach()
// TestCleanUp    === afterEach()

// --> Методы класса Assert <--
// Assert.AreEqual           === expect(...).toEqual(...)
// проверяет равенство двух значений.

// Assert.AreSame            === expect(...).toBe(...)
// проверяет, указывают ли ссылки на один и тот же объект.

// Assert.IsTrue             === expect(...).toBeTruthy()
// проверяет, что условие верно (true).

// Assert.IsNull             === expect(...).toBeNull()
// проверяет, что объект равен null.

// Assert.InstanceOfType     === expect(...).toBeInstanceOf(...)
// проверяет, соответствует ли объект указанному типу.

// Assert.ThrowsException<T> === expect(() => { ... }).toThrow(...)
// проверяет, выбрасывает ли код исключение типа T
