import { FieldErrors } from "../validators";

export class LoadEntityError extends Error {
  constructor(public error: FieldErrors, message?: string) {
    super(message ?? "An entity not be loaded");
    this.name = "LoadEntityError";
  }
}
