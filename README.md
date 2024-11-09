# BunParser

Parse terminal argument with type checking

## Setup

To use this package in your project add the registry to your .npmrc or bunfig.toml if you're using bun

### Exemple

```bash
#bunfig.toml
[install.scopes]
"@leodurillon" = {url="https://npm.pkg.github.com/"}
```

```bash
#npmrc
@leodurillon:registry=https://npm.pkg.github.com/
```

Then simply run the command

```bash
bun i @leodurillon/bun-parser
```

## How to use

To use the package you need to call the parser and keep the result in a variable

### Basic example

```js
import Parser from "@leodurillon/bun-parser";
//--Code--
const myParser = Parser.generate({
  name: "my-package-name",
  help: {
    name: "--help",
    short: "-h",
  },
  path: true,
  schema: {
    string: {
      type: "string",
      required: true,
      short: "-s",
    },
    number: {
      type: "number",
    },
    boolean: {
      type: "boolean",
    },
    regex: {
      type: "regexp",
    },
    path: {
      type: "path",
    },
  },
});
// By default an error won't stop the programs and will return the error as a string
// You're then free to stop the program continue or just log the error and continue
if (typeof myParser === "string") {
  process.exit(1);
}
```

### Types

#### Parser

| Argument    | Type                        | Example                        | Definition                                                                                                              |
| ----------- | --------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| name        | String-(Optional)           | My program name                | Name of the program that will be displayed if the help argument is called                                               |
| description | String-(Optional)           | My description                 | Description of the program that will be displayed if the help argument is called                                        |
| help        | Object-(Optional)           | { name: "--help",short: "-h",} | Argument that should be used to display help                                                                            |
| path        | Boolean-(Optional)          | true                           | If true a path should be given when the program is called                                                               |
| separator   | String-(Default "=")        | =                              | To define a custom separator between argument and value                                                                 |
| schema      | Object-(Optional) | {arg1:{type:"string"}}         | The schema containing all the argument that the program could use the key of the object define the name of the argument |

#### Help

| Argument | Type              | Example | Definition                  |
| -------- | ----------------- | ------- | --------------------------- |
| name     | String            | --help  | Name to call the help       |
| short    | String-(Optional) | -h      | Short name to call the help |

#### Shema Element

| Argument | Type                           | Example  | Definition                                                                     |
| -------- | ------------------------------ | -------- | ------------------------------------------------------------------------------ |
| type     | ShemaType(see bottom)-Required | "string" | Define the expected type for the provided argument                             |
| required | Boolean-(Optional)             | true     | If set to true the program will return an error if the argument isn't provided |
| short    | String-(Optional)              | -f       | Short name to call argument                                                    |

#### ShemaType

| Type      | Definition                                         | Exemple                     |
| --------- | -------------------------------------------------- | --------------------------- |
| "string"  | Expect the argument to be a valid string           | --arg="abc"                 |
| "number"  | Expect the argument to be a valid number           | --arg=3                     |
| "boolean" | Set the argument to true or false if called or not | --arg                       |
| "path"    | Expect the argument to be a valid path             | --arg=/path/to/fileOrFolder |
| "regexp"  | Expect the argument to be a regular expressions    | --arg=/.+/gm                |
