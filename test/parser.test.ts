import { test, expect, jest, beforeEach, describe } from "bun:test";
import Parser from "../src/lib/parser";
import data from "./data";
import ParserError from "../src/lib/parserError";

function argCleaner() {
  const length = Bun.argv.length - 2;
  for (let i = 0; i < length; i++) {
    Bun.argv.pop();
  }
}

describe("Parser", () => {
  beforeEach(() => argCleaner());

  test("Should be defined", () => {
    expect(Parser).toBeDefined();
  });

  describe("Parser Help", () => {
    test("Should display help text if help defined", () => {
      Bun.argv.push(...["--help"]);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.help);
      expect(parser).toBeString();
      expect(Bun.write).toHaveBeenCalledWith(Bun.stdout, parser);
    });
    test("Should ignore path if path is true", () => {
      Bun.argv.push(...["/path/to/test", "--help"]);
      Bun.write = jest.fn();

      const parser = Parser.generate({ ...data.help, path: true });
      expect(parser).toBeString();
      expect(Bun.write).toHaveBeenCalledWith(Bun.stdout, parser);
    });
    test("Should not require path if path is true", () => {
      Bun.argv.push(...["--help"]);
      Bun.write = jest.fn();

      const parser = Parser.generate({ ...data.help, path: true });
      expect(parser).toBeString();
      expect(Bun.write).toHaveBeenCalledWith(Bun.stdout, parser);
    });
    test("Should not display help if help not defined as helper", () => {
      Bun.argv.push(...["--help"]);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.helpInSchema);
      expect(parser).not.toBeString();
      expect(Bun.write).toHaveBeenCalledTimes(0);
    });

    test("Should display arguments help if argument provided", () => {
      Bun.argv.push(...["--test", "--help"]);
      Bun.write = jest.fn();

      new Parser(data.help).getValue();
      expect(Bun.write).toHaveBeenCalledWith(
        Bun.stdout,
        `|Name : --test\n|Type : number\n|Required : No\n|Example : --test=3\n`
      );
    });
    test("Should throw if argument not exist", () => {
      Bun.argv.push(...["--unknown", "--help"]);
      Bun.write = jest.fn();
      const parser = () => new Parser(data.help);
      expect(parser).toThrow(ParserError.argNotFound("--unknown"));
    });
  });

  describe("Parser parse", () => {
    test("Should return path", () => {
      Bun.argv.push(...["--test=3"]);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.help) as {
        path: string;
        values: any;
      };
      expect(parser).toBeObject();
      expect(parser.path).toBeDefined();
      expect(parser.path).toBe(process.cwd());
    });

    test("Should return path with extension if path is true", () => {
      Bun.argv.push(...["test/path", '--flag="test"']);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.parser) as {
        path: string;
        values: any;
      };

      expect(parser.path).toBe(process.cwd() + "/test/path");
    });

    test("Should return value of argument with good type", () => {
      Bun.argv.push(...["test/path", '--flag="test"', "--test=2", "--new"]);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.parser) as {
        path: any;
        values: {
          flag: string;
          test: number;
          new: boolean;
        };
      };
      expect(parser).toBeObject();
      expect(parser.values.flag).toBeString();
      expect(parser.values.flag).toBe("test");
      expect(parser.values.test).toBeNumber();
      expect(parser.values.test).toBe(2);
      expect(parser.values.new).toBeBoolean();
      expect(parser.values.new).toBe(true);
    });

    test("Should ignore non required value when not defined", () => {
      Bun.argv.push(...["test/path", '--flag="test"']);
      Bun.write = jest.fn();

      const parser = Parser.generate(data.parser) as {
        path: any;
        values: {
          flag: string;
          test: any;
          new: any;
        };
      };
      expect(parser).toBeObject();
      expect(parser.values.flag).toBeString();
      expect(parser.values.flag).toBe("test");
      expect(parser.values.test).toBeUndefined();
      expect(parser.values.new).toBeUndefined();
    });

    test("Should throw if missing required value", () => {
      Bun.argv.push(...["test/path"]);
      Bun.write = jest.fn();
      const parser = () => Parser.generate(data.parser);
      expect(parser).toThrow(ParserError.missingValue("--flag"));
    });

    test("Should throw if wrong type for value", () => {
      Bun.argv.push(...["test/path", '--flag="test"', "--test=test", "--new"]);
      Bun.write = jest.fn();

      const parser = () => Parser.generate(data.parser);
      expect(parser).toThrow(
        ParserError.wrongType("number", "string", "--test")
      );
    });
  });
});
