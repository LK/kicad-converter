import * as types from "./types";
import * as zod from "./zod";
import * as parse from "./parse-kicad-sch";

export const KicadSch = {
  ...types,
  ...zod,
  ...parse,
};

// Type-only exports
export type { KicadSch as Schema } from "./types";
