import ValueObject from "../value-object";

class StubValueObject extends ValueObject {}

describe("Value object Unit Tests", () => {
  it("should set value", () => {
    let sut = new StubValueObject("string value");
    expect(sut.value).toBe("string value");

    sut = new StubValueObject({ prop1: "value1" });
    console.log(`${sut}`);
    expect(sut.value).toStrictEqual({ prop1: "value1" });
  });

  it("should convert to string", () => {
    const date = new Date();
    const arrange = [
      { received: null, expected: "null" },
      { received: undefined, expected: "undefined" },
      { received: "", expected: "" },
      { received: "Fake Test", expected: "Fake Test" },
      { received: 0, expected: "0" },
      { received: 4, expected: "4" },
      { received: true, expected: "true" },
      { received: false, expected: "false" },
      { received: date, expected: date.toString() },
      { received: { prop1: "value1" }, expected: '{"prop1":"value1"}' },
    ];

    arrange.forEach((value) => {
      let sut = new StubValueObject(value.received);
      console.log(`${sut}`);
      expect(sut + "").toBe(value.expected);
    });
  });
});
