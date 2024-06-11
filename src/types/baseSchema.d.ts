export type BaseSchema = Record<
  string,
  {
    type: "string" | "number" | "boolean";
    short?: string;
    description?: string;
    required?: boolean;
  }
>;
