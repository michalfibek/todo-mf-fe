import { useState } from "react"
import styles from "./Todos.module.css"
import {
  CheckIcon,
  ExclamationCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid"
import type { TaskId } from "./todosSlice"
import {
  useAddTaskMutation,
  useDeleteTaskMutation,
  useGetTasksQuery,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
} from "./todosSlice"
import Loader from "../../components/loader"
import { useAppDispatch } from "../../app/hooks"
import { NewTaskComponent } from "./components/NewTaskComponent"
import { TaskComponent } from "./components/TaskComponent"

type filterType = "ALL" | "ACTIVE" | "COMPLETED"
type filterOptionType = {
  filterKey: filterType
  description: string
}

const filterOptions = [
  { filterKey: "ALL", description: "All tasks" },
  { filterKey: "ACTIVE", description: "Active" },
  { filterKey: "COMPLETED", description: "Completed" },
] as filterOptionType[]

export const Todos = () => {
  const dispatch = useAppDispatch()
  const [taskFilter, setTaskFilter] = useState<filterType>("ALL")
  const [editingField, setEditingField] = useState<TaskId | null>(null)
  const { data, isError, isLoading, isSuccess } = useGetTasksQuery()
  const [addTask, { isLoading: isAddTaskLoading }] = useAddTaskMutation()

  const [markComplete, { isLoading: isMarkCompleteLoading }] =
    useMarkCompleteMutation()

  const [markIncomplete, { isLoading: isMarkIncompleteLoading }] =
    useMarkIncompleteMutation()

  const [deleteTask, { isLoading: isDeleteTaskLoading }] =
    useDeleteTaskMutation()

  const [newTaskText, setNewTaskText] = useState("")

  const handleAddTask = async () => {
    if (newTaskText.trim()) {
      const response = await addTask(newTaskText)
      setNewTaskText("")
      console.log(response)
    }
  }

  const handleDeleteTask = async (taskId: TaskId) => {
    deleteTask(taskId)
  }

  const handleTaskToggle = async (id: TaskId, completed: boolean) => {
    try {
      if (completed) {
        const response = await markIncomplete(id)
        // console.log(response)
      } else {
        const response = await markComplete(id)
        // console.log(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className="flex flex-col border border-gray-300 p-4 rounded-lg text-lg max-w-xl bg-white min-w-96">
      <NewTaskComponent
        taskText={newTaskText}
        handleChangeTaskText={setNewTaskText}
        handleAddTask={handleAddTask}
        isDisabled={isAddTaskLoading}
      />

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
        {data &&
          isSuccess &&
          data
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
      <footer className="flex flex-col mt-8 text-sm text-left text-gray-400">
        {data && isSuccess && (
          <div className="">
            {data.filter(task => task.completed).length}/{data.length} completed
          </div>
        )}
        <div className="flex flex-row pt-6">
          <div className="flex-none text-left">
            <button className="group flex flex-row items-center hover:text-purple-800">
              <CheckIcon className="w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-800" />
              Mark all as completed
            </button>
          </div>
          <div className="flex-1 text-right">
            <button className="group flex flex-row place-self-end items-center hover:text-purple-800">
              <TrashIcon className="w-4 h-4 mr-2 text-purple-600 group-hover:text-purple-800" />
              Clear completed
            </button>
          </div>
        </div>
      </footer>
    </section>
  )
}
