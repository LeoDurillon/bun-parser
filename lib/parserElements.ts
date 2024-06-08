import ParserError from "./parserError";

export default class ParserElement {
  public name: string;
  public type: "string" | "number" | "boolean";
  public short?: string;
  public description?: string;
  public required?: boolean;

  /**
   * Creates an instance of ParserElement.
   * @param schema - The schema defining the parser element.
   * @param schema.name - The name of the parser element.
   * @param schema.type - The type of the parser element ("string", "number", or "boolean").
   * @param schema.short - An optional short name for the parser element.
   * @param schema.description - An optional description of the parser element.
   * @param schema.required - Indicates if the parser element is required.
   */
  constructor(schema: {
    name: string;
    type: "string" | "number" | "boolean";
    short?: string;
    description?: string;
    required?: boolean;
  }) {
    this.name = schema.name;
    this.type = schema.type;
    this.short = schema.short;
    this.description = schema.description;
    this.required = schema.required;
  }

  /**
   * Checks the type of the provided value against the expected type of the parser element.
   * @param value - The value to check.
   * @returns The transformed value if it matches the expected type.
   * @throws {ParserError} If the value does not match the expected type.
   */
  public checkType(value: unknown) {
    const transformed =
      this.type === "number"
        ? this.checkNumber(value)
        : this.checkString(value);

    return transformed;
  }

  /**
   * Checks if the required argument exists in the provided values.
   * @param values - The values to check for the existence of the required argument.
   * @returns True if the argument exists or is not required, otherwise throws an error.
   * @throws {ParserError} If the required argument is missing.
   */
  public checkExists(values: Record<string, any>) {
    if (!this.required) return true;
    if (!values[this.name.slice(2)])
      ParserError.missingValue(this.type, this.name);
    return true;
  }

  /**
   * Checks if the provided value is a valid number.
   * @param value - The value to check.
   * @returns The number if it is valid.
   * @throws {ParserError} If the value is not a valid number.
   * @private
   */
  private checkNumber(value: unknown) {
    const transformed = Number(value);
    if (isNaN(transformed)) {
      ParserError.wrongType(this.type, typeof value, this.name);
    }
    return transformed;
  }

  /**
   * Checks if the provided value is a valid string.
   * @param value - The value to check.
   * @returns The string if it is valid.
   * @throws {ParserError} If the value is not a valid string.
   * @private
   */
  private checkString(value: unknown) {
    if (typeof value !== "string") {
      ParserError.wrongType(this.type, typeof value, this.name);
    }
    return value as string;
  }
}
