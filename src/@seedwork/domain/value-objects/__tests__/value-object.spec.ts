import ValueObject from "../value-object"

class StubValueObject extends ValueObject {}

describe("Value object Unit Tests", () => {
  it("should set value", () => {
    let sut = new StubValueObject("string value");
    expect(sut.value).toBe("string value");

    sut = new StubValueObject({prop1: "value1"});
    expect(sut.value).toStrictEqual({prop1: "value1"});
  })
})
