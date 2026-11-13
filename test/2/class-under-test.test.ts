import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  AffectingClass,
  type IAffectingClass,
} from "../../src/2/affecting-class";
import { ClassUnderTest, ClassUnderTest2 } from "../../src/2/class-under-test";

// Аналог Mock<IAffectingClass> из Moq: объект-заглушка с моками vi.fn()
// и шпионом на геттере свойства val.
function createMockAff() {
  const mockAff: IAffectingClass = {
    val: 0,
    method: vi.fn<() => number>().mockReturnValue(1),
  };
  const valGetter = vi.spyOn(mockAff, "val", "get");
  return { mockAff, valGetter };
}

// 1. Тесты PublicMethod и CallAffectingMethod (параметризованные, test.each ~ TestCase)
describe("Задание 1", () => {
  test.each([
    [5, 10, 10], // val = 5, arg = 10 -> результат arg (10)
    [15, 10, 15], // val = 15, arg = 10 -> результат val (15)
    [10, 10, 10], // val = 10, arg = 10 -> результат arg (10), т.к. не строго больше
  ])("PublicMethod: val=%i, arg=%i -> %i", (val, arg, expectedResult) => {
    // Arrange
    const { mockAff, valGetter } = createMockAff();
    valGetter.mockReturnValue(val);
    const sut = new ClassUnderTest(mockAff);

    // Act
    const result = sut.publicMethod(arg);

    // Assert
    expect(result).toBe(expectedResult);
  });

  test.each([
    [1, 1], // обычный AffectingClass возвращает 1
    [42, 42], // метод переопределён через шпиона на прототипе
  ])(
    "CallAffectingMethod: method()=%i -> %i",
    (methodResult, expectedResult) => {
      // Arrange
      const methodSpy = vi
        .spyOn(AffectingClass.prototype, "method")
        .mockReturnValue(methodResult);
      const sut = new ClassUnderTest2(new AffectingClass());

      // Act
      const result = sut.callAffectingMethod();

      // Assert
      expect(result).toBe(expectedResult);
      methodSpy.mockRestore();
    },
  );
});

// 2. Тесты защищённого ProtectedMethod + верификация исключения.
// protected в TypeScript существует только на этапе компиляции,
// поэтому используем класс-обёртку (как наследник в NUnit-варианте).
describe("Задание 2", () => {
  class ClassUnderTestWrapper extends ClassUnderTest {
    callProtectedMethod(arg: number): number {
      return this.protectedMethod(arg);
    }
  }

  test.each([
    [5, 10], // arg != 0 -> должен вернуть свойство val (10)
    [-1, 42], // arg != 0 -> должен вернуть свойство val (42)
  ])(
    "ProtectedMethod: arg=%i не равен 0 -> возвращает val=%i",
    (arg, expectedVal) => {
      // Arrange
      const { mockAff, valGetter } = createMockAff();
      valGetter.mockReturnValue(expectedVal);
      const sut = new ClassUnderTestWrapper(mockAff);

      // Act
      const result = sut.callProtectedMethod(arg);

      // Assert
      expect(result).toBe(expectedVal);
    },
  );

  test("ProtectedMethod: arg=0 -> выбрасывает исключение", () => {
    // Arrange
    const { mockAff } = createMockAff();
    const sut = new ClassUnderTestWrapper(mockAff);

    // Act & Assert
    expect(() => sut.callProtectedMethod(0)).toThrow(TypeError);
    expect(() => sut.callProtectedMethod(0)).toThrow("arg is equal to zero");
  });
});

// 3. Тест публичного метода с заглушкой зависимости IAffectingClass:
// с beforeEach (аналог [SetUp]) и без него
describe("Задание 3", () => {
  describe("С beforeEach (аналог [SetUp])", () => {
    let mockAff: IAffectingClass;
    let valGetter: ReturnType<typeof vi.spyOn>;
    let sut: ClassUnderTest;

    // Вызывается автоматически ПЕРЕД КАЖДЫМ тестом в этом describe
    beforeEach(() => {
      ({ mockAff, valGetter } = createMockAff());
      sut = new ClassUnderTest(mockAff);
    });

    test.each([
      [5, 10, 10],
      [20, 10, 20],
    ])(
      "PublicMethod с beforeEach: val=%i, arg=%i -> %i",
      (val, arg, expectedResult) => {
        // Настраиваем мок, подготовленный в beforeEach
        valGetter.mockReturnValue(val);

        const result = sut.publicMethod(arg);

        expect(result).toBe(expectedResult);
      },
    );
  });

  describe("Без beforeEach", () => {
    test.each([
      [5, 10, 10],
      [20, 10, 20],
    ])(
      "PublicMethod без beforeEach: val=%i, arg=%i -> %i",
      (val, arg, expectedResult) => {
        // Всё создание и настройка происходят локально внутри теста (self-contained)
        const { mockAff, valGetter } = createMockAff();
        valGetter.mockReturnValue(val);
        const sut = new ClassUnderTest(mockAff);

        const result = sut.publicMethod(arg);

        expect(result).toBe(expectedResult);
      },
    );
  });
});

// 6. Верификация с помощью мока, что был осуществлён вызов свойства val
describe("Задание 6", () => {
  test("PublicMethod читает свойство val", () => {
    // Arrange
    const { mockAff, valGetter } = createMockAff();
    valGetter.mockReturnValue(10);
    const sut = new ClassUnderTest(mockAff);

    // Act
    sut.publicMethod(5);

    // Assert: свойство читается дважды (в сравнении и в тернарном операторе)
    expect(valGetter).toHaveBeenCalledTimes(2);
  });
});

// NUnit/Moq  <==>  Vitest
// TestFixture            === describe()
// Test / TestCase        === test() / test.each()
// SetUp                  === beforeEach()
// Mock<T>, Setup         === vi.fn(), vi.spyOn(..., "get").mockReturnValue(...)
// Verify(..., Times.N)   === expect(spy).toHaveBeenCalledTimes(N)
// Assert.Throws<T>       === expect(() => { ... }).toThrow(T)
