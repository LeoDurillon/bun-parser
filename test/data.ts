import type { ParserConstructor } from "../src/types/parserConstructor";
import type { BaseSchema } from "../src/types/baseSchema";

export default {
  help: {
    name: "test",
    schema: {
      test: {
        type: "number",
      },
    },
    help: {
      name: "--help",
      short: "-h",
    },
  },
  helpInSchema: {
    name: "test",
    schema: {
      help: {
        type: "boolean",
      },
    },
  },
  parser: {
    name: "parser",
    path: true,
    schema: {
      flag: {
        type: "string",
        required: true,
        short: "-f",
      },
      test: {
        type: "number",
      },
      new: {
        type: "boolean",
      },
      regex: {
        type: "regexp",
      },
      testPath: {
        type: "path",
      },
      string2: {
        type: "string",
      },
    },
  },
} satisfies Record<string, ParserConstructor<BaseSchema>>;
