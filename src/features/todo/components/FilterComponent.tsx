import type { TFilterKey } from "../types/TFilter";

import { memo } from "react";
import { filterOptionsStore } from "../store/filters";

type FilterComponentProps = {
  activeFilter: TFilterKey;
  handleChangeActiveFilter: (filterKey: TFilterKey) => void;
};

export const FilterComponent = memo(function ({
  activeFilter,
  handleChangeActiveFilter,
}: FilterComponentProps) {
  return (
    <div className="task-filter mt-6 flex flex-row space-x-2 text-sm">
      {filterOptionsStore.map(filter => (
        <button
          key={filter.key}
          className={`py-1 px-2 border rounded-lg ${activeFilter === filter.key ? "bg-purple-50 border-purple-400 hover:bg-purple-200" : ""}`}
          onClick={() => handleChangeActiveFilter(filter.key)}
        >
          {filter.description}
        </button>
      ))}
    </div>
  );
});
