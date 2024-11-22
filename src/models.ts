import type { Accessor } from "solid-js";

export enum ViewMode {
  grid = "grid",
  list = "list",
}

export type Identity<T> = T extends object
  ? {} & {
      [P in keyof T]: T[P];
    }
  : T;
