import {
  useDeleteTaskMutation,
  useEditTaskMutation,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
  type Task,
  type TaskId,
  type TaskText,
} from "../store/todoSlice";
import { useEffect, useRef, useState } from "react";
import {
  CheckCircleIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { useAppDispatch } from "../../../app/hooks";
import { showPopup } from "../../popup/popupSlice";

type TaskComponentProps = {
  task: Task;
  isEditing: boolean;
  handleSetEditing: (editing: boolean) => void;
};

export const TaskComponent = ({
  task,
  isEditing,
  handleSetEditing,
}: TaskComponentProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const inputField = useRef<HTMLInputElement>(null);
  const [taskText, setTaskText] = useState(task.text);

  const [markComplete, { isError: isMarkCompleteError }] =
    useMarkCompleteMutation();

  const [markIncomplete, { isError: isMarkIncompleteError }] =
    useMarkIncompleteMutation();

  const [deleteTask, { isError: isDeleteTaskError }] = useDeleteTaskMutation();

  const [editTask, { isError: isEditTaskError }] = useEditTaskMutation();

  const hasError =
    isMarkCompleteError ||
    isMarkIncompleteError ||
    isDeleteTaskError ||
    isEditTaskError;

  useEffect(() => {
    if (hasError) {
      dispatch(
        showPopup({
          message: "Server Error: Cannot update the task",
          type: "error",
        }),
      );
    }
  }, [hasError, dispatch]);

  const handleDeleteTask = async (id: TaskId) => {
    await deleteTask(id);
  };

  const handleTaskToggle = async (id: TaskId, completed: boolean) => {
    try {
      if (completed) {
        await markIncomplete(id);
      } else {
        await markComplete(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSaveEdit = async (taskText: TaskText) => {
    await editTask({ id: task.id, taskText: taskText });
    handleSetEditing(false);
  };

  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.code.toLowerCase() === "escape") {
        setTaskText(task.text);
        handleSetEditing(false);
      }
    }
    return document.addEventListener("keydown", callback);
  }, [isEditing, handleSetEditing, task]);

  useEffect(() => {
    if (isEditing) {
      inputField.current && inputField.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      key={task.id}
      className={`group flex flex-row items-center px-4 -mx-4 py-2 ${isEditing ? "bg-purple-100" : "hover:bg-purple-100"}`}
    >
      <div className="checkbox flex mr-2">
        <input
          type="checkbox"
          className="w-6 h-6 accent-purple-500 hover:accent-purple-700"
          checked={task.completed}
          onChange={() => handleTaskToggle(task.id, task.completed)}
        />
      </div>
      <div className="grow text-left">
        {!isEditing ? (
          <span
            onDoubleClick={() => handleSetEditing(true)}
            className="block px-2 full-width"
          >
            {taskText}
          </span>
        ) : (
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSaveEdit(taskText);
            }}
            className="full-width"
          >
            <input
              type="text"
              className="block full-width px-2"
              ref={inputField}
              value={taskText}
              onChange={e => setTaskText(e.target.value)}
            />
          </form>
        )}
      </div>
      <div className="flex flex-row ml-4">
        {isEditing ? (
          <button onClick={() => handleSaveEdit(taskText)} title="Save task">
            <CheckCircleIcon className="invisible group-hover:visible w-6 h-6 mr-2 text-green-600 hover:text-green-600" />
          </button>
        ) : (
          <button onClick={() => handleSetEditing(true)} title="Edit task">
            <PencilSquareIcon className="invisible group-hover:visible w-6 h-6 mr-2 text-blue-400 hover:text-blue-600" />
          </button>
        )}
        <button onClick={() => handleDeleteTask(task.id)} title="Delete task">
          <XMarkIcon className="invisible group-hover:visible w-6 h-6 text-red-400 hover:text-red-600" />
        </button>
      </div>
    </div>
  );
};
