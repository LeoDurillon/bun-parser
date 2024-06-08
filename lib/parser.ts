import ParserElement from "./parserElements";
import ParserError from "./parserError";

/**
 * A class to parse command-line arguments based on a defined schema.
 * @template T - The schema type extending BaseSchema.
 */
export default class Parser<T extends BaseSchema> {
  private name: string;
  private description?: string;
  private args: string[];
  private place: string;
  private separator: string;
  private schema: ParserElement[];
  private help?: { name: string; short: string };
  private path: boolean;

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
  constructor(props: {
    name?: string;
    description?: string;
    schema: T;
    path?: boolean;
    help?: { name: string; short: string };
    separator?: string;
  }) {
    this.name = props.name ?? "Program";
    this.description = props.description;
    this.args = Bun.argv.slice(
      props.path && ![props.help?.name, props.help?.short].includes(Bun.argv[2])
        ? 3
        : 2
    );
    this.place = `${Bun.argv[1]}${props.path ? "/" + Bun.argv[2] : ""}`;
    this.separator = props.separator ?? "=";
    this.schema = Object.keys(props.schema).map(
      (e) => new ParserElement({ name: "--" + e, ...props.schema[e] })
    );
    this.path = props.path ?? false;
    this.help = props.help;
  }

  /**
   * Parses the command-line arguments based on the schema.
   * @returns An object containing the parsed path and values.
   * @throws {ParserError} If an argument is not found in the schema.
   */
  parse() {
    if (this.help) this.helper();
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
      values: result as Args<T>,
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
      .filter((e) =>
        this.schema.find(
          (s) => s.name === e || e === help.name || e === help.short
        )
      );
    let helpIndex = args.indexOf(help.name);
    if (helpIndex < 0 && !help.short) {
      return;
    }
    if (helpIndex < 0 && help.short) {
      helpIndex = args.indexOf(help.short);
      if (helpIndex < 0) return;
    }
    if (helpIndex > 0) {
      const map = args
        .slice(0, helpIndex)
        .map((e) => this.schema.find((s) => s.name === e))
        .filter((e) => !!e);
      if (!map.length) {
        ParserError.argNotFound();
      }
      Bun.write(Bun.stdout, map.map((e) => this.message(e!)).join("\n"));
    } else {
      const map = this.schema.map((e) => this.message(e));
      Bun.write(
        Bun.stdout,
        `Program : ${this.name}\nDescription : ${
          this.description
        }\nSeparator : ${this.separator}\n\nHelp args : ${help.name}${
          help.short ? " & " + help.short : ""
        }\n\nbunx ${this.name} ${
          this.path ? "[PATH] " : ""
        }[OPTION]\n\nOption :\n${map.join("\n")}`
      );
    }
    process.exit(0);
  }

  /**
   * Formats a message for a given parser element.
   * @param e - The parser element to format.
   * @returns A formatted string with the element's details.
   * @private
   */
  private message(e: ParserElement) {
    return `|Name : ${e.name}\n|Short : ${e.short}\n|Description : ${
      e.description
    }\n|Type : ${e.type}\n|Required : ${
      e.required ? "Yes" : "No"
    }\n|Example : ${e.name}${
      e.type !== "boolean"
        ? `${this.separator}${e.type === "number" ? 3 : '"exemple"'}`
        : ""
    }\n`;
  }
}
