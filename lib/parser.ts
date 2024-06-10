import ParserElement from "./parserElements";
import ParserError from "./parserError";

/**
 * A class to parse command-line arguments based on a defined schema.
 * @template T - The schema type extending BaseSchema.
 */
export default class Parser<T extends BaseSchema> {
  private name?: string;
  private description?: string;
  private args: string[];
  public place: string;
  private separator: string;
  private schema: ParserElement[];
  private help?: { name: string; short: string };
  private path: boolean;
  public value: string | { path: string; values: ParsedValue<T> };
  /**
   * Creates an instance of Parser.
   * @param props - The properties for initializing the parser.
   * @param props.name - The name of the program.
   * @param props.description - The description of the program.
   * @param props.schema - The schema defining the expected arguments.
   * @param props.path - Indicates if the path should be included in the arguments.
   * @param props.help - The help options for the program.
   * @param props.separator - The separator for argument values.
   */
  constructor({
    name,
    description,
    help,
    path,
    separator,
    schema,
  }: ParserConstructor<T>) {
    this.name = name;
    this.description = description;
    this.args = Bun.argv.slice(
      path && ![help?.name, help?.short].includes(Bun.argv[2]) ? 3 : 2
    );
    this.place = `${process.cwd()}${path ? "/" + Bun.argv[2] : ""}`;
    this.separator = separator ?? "=";
    this.schema = Object.keys(schema).map(
      (e) => new ParserElement({ name: "--" + e, ...schema[e] })
    );
    this.path = path ?? false;
    this.help = help;
    this.value = this.parse();
  }

  /**
   * Parses the command-line arguments based on the schema.
   * @returns A string with help information or An object containing the parsed path and values.
   * @throws {ParserError} If an argument is not found in the schema.
   * @private
   */
  private parse() {
    if (
      this.help &&
      (this.args.includes(this.help.name) ||
        this.args.includes(this.help.short))
    )
      return this.helper();

    const result = Object();
    for (const argValue of this.args) {
      const [arg, value] = argValue.split(this.separator);
      const element = this.schema.find((e) => e.name === arg);
      if (!element) {
        throw ParserError.argNotFound(arg);
      }
      if (element.type !== "boolean") {
        const res = element.checkType(value);
        result[element.name.slice(2)] = res;
      } else {
        result[element.name.slice(2)] = true;
      }
    }
    this.schema.every((e) => e.checkExists(result));
    return {
      path: this.place,
      values: result as ParsedValue<T>,
    };
  }

  /**
   * Displays help information and exits the process if the help argument is found.
   * @private
   */
  private helper() {
    const help = this.help!;
    const args = this.args
      .flatMap((e) => e.split(this.separator))
      .filter((e) => e.includes("--"));
    let helpIndex = args.indexOf(help.name);
    if (helpIndex < 0 && help.short) {
      helpIndex = args.indexOf(help.short);
    }

    if (helpIndex > 0) {
      const argument = args.slice(0, helpIndex);
      const map = [];
      for (const arg of argument) {
        const el = this.schema.find((e) => e.name === arg);
        if (!el) throw ParserError.argNotFound(arg);
        map.push(el);
      }
      return map.map((e) => this.message(e!)).join("\n");
    } else {
      const map = this.schema.map((e) => this.message(e));
      return `${this.name ? `Program : ${this.name}\n` : ""}${
        this.description ? `Description : ${this.description}\n` : ""
      }Separator : ${this.separator}\n\nHelp args : ${help.name}${
        help.short ? " & " + help.short : ""
      }\n\nbunx ${this.name ? this.name : ""} ${
        this.path ? "[PATH] " : ""
      }[OPTION]\n\nOption :\n${map.join("\n")}`;
    }
  }

  /**
   * Formats a message for a given parser element.
   * @param e - The parser element to format.
   * @returns A formatted string with the element's details.
   * @private
   */
  private message(e: ParserElement) {
    return `|Name : ${e.name}\n${e.short ? `|Short : ${e.short}\n` : ""}${
      e.description
        ? `|Description : 
      ${e.description}\n`
        : ""
    }|Type : ${e.type}\n|Required : ${e.required ? "Yes" : "No"}\n|Example : ${
      e.name
    }${
      e.type !== "boolean"
        ? `${this.separator}${e.type === "number" ? 3 : '"exemple"'}`
        : ""
    }\n`;
  }

  /**
   * Return the value of the command-line arguments based on the schema.
   * Write in stdout the help information if the help flag was triggered
   * @returns A string with help information or An object containing the parsed path and values.
   */
  getValue() {
    if (typeof this.value === "string") Bun.write(Bun.stdout, this.value);
    return this.value;
  }

  /**
   * Shorthand function to creates an instance of Parser and return the value.
   * @param props - The properties for initializing the parser.
   * @returns A string with help information or An object containing the parsed path and values.
   */
  static generate<T extends BaseSchema>(props: ParserConstructor<T>) {
    return new Parser(props).getValue();
  }
}
