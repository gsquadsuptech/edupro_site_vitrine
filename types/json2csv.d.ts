declare module "json2csv" {
  export type ParserOptions<TInput = unknown> = Record<string, unknown>;

  export class Parser<TInput = unknown> {
    constructor(options?: ParserOptions<TInput>);
    parse(data: TInput[] | TInput): string;
  }
}

declare module "json2csv/lib/json2csv.js" {
  export * from "json2csv";
}


