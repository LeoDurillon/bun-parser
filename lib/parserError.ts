export default class ParserError {
  /**
   * Handles the case when an argument is not found.
   * @param argName - The name of the argument that was not found.
   */
  static argNotFound(argName?: string) {
    Bun.write(
      Bun.stdout,
      `${argName ? argName + " a" : "A"}rguments not found\n`
    );
    process.exit(1);
  }

  /**
   * Handles the case when an argument has the wrong type.
   * @param expected - The expected type of the argument.
   * @param found - The actual type of the argument.
   * @param argName - The name of the argument that has the wrong type.
   */
  static wrongType(expected: string, found: string, argName?: string) {
    Bun.write(
      Bun.stdout,
      `${
        argName ? argName + " w" : "W"
      }rong type expected ${expected} found ${found}\n`
    );
    process.exit(1);
  }

  /**
   * Handles the case when a value is missing for an argument.
   * @param expected - The expected value type.
   * @param argName - The name of the argument that is missing a value.
   */
  static missingValue(expected: string, argName: string) {
    Bun.write(Bun.stdout, `${argName ? argName + " i" : "I"}s required\n`);
    process.exit(1);
  }
}
