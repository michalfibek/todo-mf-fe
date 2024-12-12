import type { TFilter } from "../types/TFilter";

export const filterOptionsStore = [
  {
    key: "ALL",
    description: "All tasks",
    filterCallback() {
      return true;
    },
  },
  {
    key: "ACTIVE",
    description: "Active",
    filterCallback(task) {
      return !task.completed;
    },
  },
  {
    key: "COMPLETED",
    description: "Completed",
    filterCallback(task) {
      return task.completed;
    },
  },
] as TFilter[];

export const defaultFilter = "ALL";
