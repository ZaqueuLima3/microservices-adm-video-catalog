import { deepFreeze } from "../utils/object";

export abstract class ValueObject<Value = any> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }

  toString = () => {
    if (typeof this._value !== "object" || this._value === null) {
      try {
        return this._value.toString();
      } catch (e) {
        return JSON.stringify(this._value);
      }
    }
    return this._value.toString() == "[object Object]"
      ? JSON.stringify(this._value)
      : this._value.toString();
  };
}

export default ValueObject;
