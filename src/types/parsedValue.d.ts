export type ParsedValue<T extends BaseSchema> = {
  [P in keyof T]: T[P] extends { required: true }
    ? SchemaType[T[P]["type"]]
    : SchemaType[T[P]["type"]] | undefined;
};
