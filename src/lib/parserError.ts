export default class ParserError {
  /**
   * Handles the case when an argument is not found.
   * @param argName - The name of the argument that was not found.
   */
  static argNotFound(argName?: string) {
    return Error(`${argName ? argName + " a" : "A"}rguments not found\n`);
  }

  /**
   * Handles the case when an argument has the wrong type.
   * @param expected - The expected type of the argument.
   * @param found - The actual type of the argument.
   * @param argName - The name of the argument that has the wrong type.
   */
  static wrongType(expected: string, found: string, argName?: string) {
    return Error(
      `${
        argName ? argName + " w" : "W"
      }rong type expected ${expected} found ${found}\n`
    );
  }

  /**
   * Handles the case when a value is missing for an argument.
   * @param argName - The name of the argument that is missing a value.
   */
  static missingValue(argName: string) {
    return Error(`${argName ? argName + " i" : "I"}s required\n`);
  }

  /**
   * Handles the case when no path wath found in arguments.
   */
  static missingPath() {
    return Error("An argument for path was expected but found nothing");
  }
}
