import type { TFilterKey } from "./types/TFilter";
import type { TTask, TTaskId } from "./types/TTask";

import { useCallback, useMemo, useState } from "react";

import { useGetTasksQuery } from "./store/todoSlice";
import { defaultFilter, filterOptionsStore } from "./store/filters";

import { NewTaskComponent } from "./components/NewTaskComponent";
import { TaskComponent } from "./components/TaskComponent";
import { FilterComponent } from "./components/FilterComponent";
import { ToolbarComponent } from "./components/ToolbarComponent";
import { ErrorTasksComponent } from "./components/ErrorTasksComponent";
import Loader from "../../components/loader";

export const Todo = () => {
  const [activeFilter, setActiveFilter] = useState<TFilterKey>(defaultFilter);
  const [editingField, setEditingField] = useState<TTaskId | null>(null);
  const { data: tasks, isError, isLoading } = useGetTasksQuery();
  const tasksEmpty = tasks?.length === 0 || tasks === undefined;

  const filterTasks = useCallback(
    (task: TTask) => {
      const filterCallback = filterOptionsStore.find(
        filter => filter.key === activeFilter,
      )?.filterCallback;

      // no callback, show all tasks
      if (!filterCallback) return true;

      return filterCallback(task);
    },
    [activeFilter],
  );

  const handleSetEditing = useCallback((taskId: TTaskId, editing: boolean) => {
    setEditingField(editing ? taskId : null);
  }, []);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks
      .filter(task => filterTasks(task))
      .map(task => (
        <TaskComponent
          key={task.id}
          task={task}
          isEditing={task.id === editingField}
          onSetEditing={handleSetEditing}
        />
      ));
  }, [tasks, filterTasks, editingField, handleSetEditing]);

  const handleChangeActiveFilter = (filterKey: TFilterKey) => {
    setActiveFilter(filterKey);
  };

  return (
    <section className="flex flex-col border border-gray-300 p-4 rounded-lg text-lg max-w-xl bg-white min-w-96">
      <NewTaskComponent />

      <FilterComponent
        activeFilter={activeFilter}
        handleChangeActiveFilter={handleChangeActiveFilter}
      />

      <div className="tasklist flex flex-col mt-2">
        {isError && <ErrorTasksComponent />}
        {isLoading && (
          <div className="flex items-center my-6 text-center self-center">
            <Loader>Loading tasks...</Loader>
          </div>
        )}
        {tasksEmpty && (
          <div className="flex items-center my-6 text-center self-center">
            <span>Everyhing done for now. Good job!</span>
          </div>
        )}
        {filteredTasks}
      </div>
      <ToolbarComponent />
    </section>
  );
};
