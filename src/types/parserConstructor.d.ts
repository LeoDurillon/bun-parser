export interface ParserConstructor<T extends BaseSchema> {
  name?: string;
  description?: string;
  schema?: T;
  path?: boolean;
  help?: { name: string; short: string };
  separator?: string;
}
