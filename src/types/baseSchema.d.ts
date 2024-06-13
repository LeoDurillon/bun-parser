export type BaseSchema = Record<
  string,
  {
    type: "string" | "number" | "boolean" | "path" | "regexp";
    short?: string;
    description?: string;
    required?: boolean;
    example?: string;
  }
>;
