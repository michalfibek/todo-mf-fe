import { useEffect, useState } from "react"
import {
  CheckIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid"
import type { TaskId } from "./todoSlice"
import {
  useDeleteTaskMutation,
  useGetTasksQuery,
  useMarkCompleteMutation,
} from "./todoSlice"
import Loader from "../../components/loader"
import { NewTaskComponent } from "./components/NewTaskComponent"
import { TaskComponent } from "./components/TaskComponent"
import { useAppDispatch } from "../../app/hooks"
import { showPopup } from "../popup/popupSlice"

type filterType = "ALL" | "ACTIVE" | "COMPLETED"
type filterOptionType = {
  filterKey: filterType
  description: string
}

const styles = {
  smIcon: "w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-800",
  filterOption: "py-1 px-2 border rounded-lg",
  selectedFilter: "bg-purple-50 border-purple-400 hover:bg-purple-200",
  tasksFooter: "flex flex-col mt-8 text-sm text-left text-gray-400",
}

const filterOptions = [
  { filterKey: "ALL", description: "All tasks" },
  { filterKey: "ACTIVE", description: "Active" },
  { filterKey: "COMPLETED", description: "Completed" },
] as filterOptionType[]

export const Todo = () => {
  const dispatch = useAppDispatch()
  const [taskFilter, setTaskFilter] = useState<filterType>("ALL")
  const [editingField, setEditingField] = useState<TaskId | null>(null)
  const { data: tasks, isError, isLoading } = useGetTasksQuery()

  const [markComplete, { error: isMarkCompleteError }] =
    useMarkCompleteMutation()

  const [deleteTask, { error: isDeleteTaskError }] = useDeleteTaskMutation()

  useEffect(() => {
    isMarkCompleteError &&
      dispatch(
        showPopup({
          message: "Server Error: Cannot mark all tasks as complete",
          type: "error",
        }),
      )

    isDeleteTaskError &&
      dispatch(
        showPopup({
          message: "Server Error: Cannot delete all complete tasks",
          type: "error",
        }),
      )
  }, [isMarkCompleteError, isDeleteTaskError, dispatch])

  const deleteAllCompleted = async () => {
    try {
      tasks?.filter(task => task.completed).map(task => deleteTask(task.id))
    } catch (error) {
      console.log(error)
    }
  }

  const markAllCompleted = async () => {
    try {
      tasks
        ?.filter(task => task.completed === false)
        .map(task => markComplete(task.id))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="flex flex-col border border-gray-300 p-4 rounded-lg text-lg max-w-xl bg-white min-w-96">
      <NewTaskComponent />
      <div className="task-filter mt-6 flex flex-row space-x-2 text-sm">
        {filterOptions.map(option => (
          <button
            key={option.filterKey}
            className={`${styles.filterOption} ${taskFilter === option.filterKey ? styles.selectedFilter : ""}`}
            onClick={() => setTaskFilter(option.filterKey)}
          >
            {option.description}
          </button>
        ))}
      </div>
      <div className="tasklist flex flex-col mt-2">
        {isError && (
          <div className="flex items-center my-6 text-center self-center text-red-600">
            <ExclamationCircleIcon className="w-6 h-6 mr-2 " />
            <span>Error loading tasks</span>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center my-6 text-center self-center">
            <Loader>Loading tasks...</Loader>
          </div>
        )}
        {tasks?.length === 0 && (
          <div className="flex items-center my-6 text-center self-center">
            <span>Everyhing done for now. Good job!</span>
          </div>
        )}
        {tasks &&
          tasks
            .filter(
              task =>
                taskFilter === "ALL" ||
                (taskFilter === "ACTIVE" && !task.completed) ||
                (taskFilter === "COMPLETED" && task.completed),
            )
            .map(task => (
              <TaskComponent
                key={task.id}
                task={task}
                isEditing={task.id === editingField}
                handleSetEditing={(editing: boolean) =>
                  setEditingField(editing ? task.id : null)
                }
              />
            ))}
      </div>
      {tasks && tasks.length > 0 && (
        <footer className="flex flex-col mt-8 text-sm text-left text-gray-400">
          <div>
            {tasks.filter(task => task.completed).length}/{tasks.length}{" "}
            completed
          </div>
          <div className="flex flex-row pt-6">
            <div className="flex-none text-left">
              <button
                onClick={markAllCompleted}
                className="group flex flex-row items-center hover:text-purple-800"
              >
                <CheckIcon className={styles.smIcon} />
                Mark all as completed
              </button>
            </div>
            <div className="flex-1 text-right">
              <button
                onClick={deleteAllCompleted}
                className="group flex flex-row place-self-end items-center hover:text-purple-800"
              >
                <TrashIcon className={styles.smIcon} />
                Clear completed
              </button>
            </div>
          </div>
        </footer>
      )}
    </section>
  )
}
