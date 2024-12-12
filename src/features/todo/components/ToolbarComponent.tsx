import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useMarkCompleteMutation,
} from "../store/todoSlice";
import { CheckIcon, TrashIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { showPopup } from "../../popup/popupSlice";

export const ToolbarComponent = () => {
  const dispatch = useAppDispatch();
  const { data: tasks, isError, isLoading } = useGetTasksQuery();
  const tasksEmpty = tasks?.length === 0 || tasks === undefined;

  const [markComplete, { error: isMarkCompleteError }] = useMarkCompleteMutation();

  const [deleteTask, { error: isDeleteTaskError }] = useDeleteTaskMutation();

  const deleteAllCompleted = async () => {
    try {
      tasks?.filter(task => task.completed).map(task => deleteTask(task.id));
    } catch (error) {
      console.log(error);
    }
  };

  const markAllCompleted = async () => {
    try {
      tasks?.filter(task => task.completed === false).map(task => markComplete(task.id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    isMarkCompleteError &&
      dispatch(
        showPopup({
          message: "Server Error: Cannot mark all tasks as complete",
          type: "error",
        }),
      );

    isDeleteTaskError &&
      dispatch(
        showPopup({
          message: "Server Error: Cannot delete all complete tasks",
          type: "error",
        }),
      );
  }, [isMarkCompleteError, isDeleteTaskError, dispatch]);

  if (isLoading || isError || tasksEmpty) {
    return null;
  }

  return (
    <>
      <footer className="flex flex-col mt-8 text-sm text-left text-gray-400">
        <div>
          {tasks.filter(task => task.completed).length}/{tasks.length} completed
        </div>
        <div className="flex flex-row pt-6">
          <div className="flex-none text-left">
            <button
              onClick={markAllCompleted}
              className="group flex flex-row items-center hover:text-purple-800"
            >
              <CheckIcon className="w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-800" />
              Mark all as completed
            </button>
          </div>
          <div className="flex-1 text-right">
            <button
              onClick={deleteAllCompleted}
              className="group flex flex-row place-self-end items-center hover:text-purple-800"
            >
              <TrashIcon className="w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-800" />
              Clear completed
            </button>
          </div>
        </div>
      </footer>
    </>
  );
};
