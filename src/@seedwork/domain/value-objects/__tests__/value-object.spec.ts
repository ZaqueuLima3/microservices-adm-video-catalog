import ValueObject from "#seedwork/domain/value-objects/value-object";

class StubValueObject extends ValueObject {}

describe("Value object Unit Tests", () => {
  it("should set value", () => {
    let sut = new StubValueObject("string value");
    expect(sut.value).toBe("string value");

    sut = new StubValueObject({ prop1: "value1" });
    expect(sut.value).toStrictEqual({ prop1: "value1" });
  });

  it("should convert to string", () => {
    const date = new Date();
    const arrange = [
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
      expect(sut + "").toBe(value.expected);
    });
  });

  it("should be a immutable object", () => {
    const obj = {
      prop1: "value1",
      deep: { prop2: "value2", prop3: new Date() },
    };

    const sut = new StubValueObject(obj);

    expect(() => {
      (sut as any).value.prop1 = "new value";
    }).toThrow(
      "Cannot assign to read only property 'prop1' of object '#<Object>'"
    );

    expect(() => {
      (sut as any).value.deep.prop2 = "new value";
    }).toThrow(
      "Cannot assign to read only property 'prop2' of object '#<Object>'"
    );

    expect(sut.value.deep.prop3).toBeInstanceOf(Date);
  });
});
