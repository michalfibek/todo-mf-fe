import type { TFilter } from "../types/TFilter";

export const filterOptionsStore = [
  {
    key: "ALL",
    description: "All tasks",
    filterFunc(task) {
      return true;
    },
  },
  {
    key: "ACTIVE",
    description: "Active",
    filterFunc(task) {
      return !task.completed;
    },
  },
  {
    key: "COMPLETED",
    description: "Completed",
    filterFunc(task) {
      return task.completed;
    },
  },
] as TFilter[];

export const defaultFilter = "ALL";
