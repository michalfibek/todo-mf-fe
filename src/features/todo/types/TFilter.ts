import type { TTask } from "./TTask";

export type TFilterFunction = (task: TTask) => boolean;
export type TFilterKey = string;

export type TFilter = {
  key: TFilterKey;
  description: string;
  filterCallback: TFilterFunction;
};
