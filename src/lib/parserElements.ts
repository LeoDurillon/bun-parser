import ParserError from "./parserError";

export default class ParserElement {
  public name: string;
  public type: "string" | "number" | "boolean" | "path" | "regexp";
  public short?: string;
  public description?: string;
  public required?: boolean;
  public example?: string;

  /**
   * Creates an instance of ParserElement.
   * @param schema - The schema defining the parser element.
   * @param schema.name - The name of the parser element.
   * @param schema.type - The type of the parser element ("string", "number", or "boolean").
   * @param schema.short - An optional short name for the parser element.
   * @param schema.description - An optional description of the parser element.
   * @param schema.required - Indicates if the parser element is required.
   * @param schema.example - Example of value
   */
  constructor(schema: {
    name: string;
    type: "string" | "number" | "boolean" | "path" | "regexp";
    short?: string;
    description?: string;
    required?: boolean;
    example?: string;
  }) {
    this.name = schema.name;
    this.type = schema.type;
    this.short = schema.short;
    this.description = schema.description;
    this.required = schema.required;
    this.example = schema.example;
  }

  /**
   * Checks the type of the provided value against the expected type of the parser element.
   * @param value - The value to check.
   * @returns The transformed value if it matches the expected type.
   * @throws {ParserError} If the value does not match the expected type.
   */
  public checkType(value: unknown) {
    let transformed: string | number | RegExp =
      this.type === "number"
        ? this.checkNumber(value)
        : this.checkString(value);

    if (this.type === "path") {
      transformed = this.checkPath(transformed as string);
    }

    if (this.type === "regexp") {
      transformed = this.checkRegEXP(transformed as string);
    }

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
    if (!values[this.name.slice(2)]) throw ParserError.missingValue(this.name);
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
      throw ParserError.wrongType(this.type, typeof value, this.name);
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
      throw ParserError.wrongType(this.type, typeof value, this.name);
    }
    if (value.length < 1) {
      throw ParserError.missingValue(this.name);
    }

    if (value[0] === value[value.length - 1] && ['"', "'"].includes(value[0]))
      return value.slice(1, -1);
    return value as string;
  }

  /**
   * Checks if the provided value is a valid path.
   * @param value - The value to check.
   * @returns The path if it is valid.
   * @throws {ParserError} If the value is not a valid string.
   * @private
   */
  private checkPath(value: string) {
    const match = new RegExp(/(^(.?)(\/))+.*\/?/).exec(value);
    if (!match) throw ParserError.wrongType(this.type, value, this.name);
    return `${process.cwd()}/${value.replace(/^(.?)(\/)/, "$1")}`;
  }

  /**
   * Transform the value as regexp
   * @param value - The value to check.
   * @returns The RegExp.
   * @private
   */
  private checkRegEXP(value: string) {
    const regexp = new RegExp(value);
    return regexp;
  }
}
