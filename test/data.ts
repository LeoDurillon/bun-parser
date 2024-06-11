import type { BaseSchema, ParserConstructor } from "../dist";

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
    },
  },
} satisfies Record<string, ParserConstructor<BaseSchema>>;
