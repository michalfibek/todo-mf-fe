import { useState } from "react"
import styles from "./Todos.module.css"
import {
  CheckIcon,
  ExclamationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"
import { useGetTasksQuery } from "./todosSlice"
import Loader from "../../components/loader"
import { useAppDispatch } from "../../app/hooks"

// const mockData = [
//   {
//     id: "1",
//     text: "Task 1",
//     completed: false,
//     createdDate: 0,
//     completedDate: 0,
//   },
//   {
//     id: "2",
//     text: "Another task",
//     completed: false,
//     createdDate: 0,
//     completedDate: 0,
//   },
//   {
//     id: "3",
//     text: "Task with long description and stuff and long description forced to break into another line",
//     completed: true,
//     createdDate: 0,
//     completedDate: 0,
//   },
//   {
//     id: "4",
//     text: "Different task",
//     completed: false,
//     createdDate: 0,
//     completedDate: 0,
//   },
// ]

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

  const { data, isError, isLoading, isSuccess } = useGetTasksQuery()

  return (
    <section className="flex flex-col border border-gray-300 p-4 rounded-lg text-lg max-w-xl bg-white min-w-96">
      <div className="mb-4">
        <input
          type="text"
          className="block w-full px-4 py-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-base"
          placeholder="Buy new coffee beans"
        />
      </div>
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
              <div
                key={task.id}
                className="group flex flex-row items-center px-4 -mx-4 py-2 hover:bg-lime-100"
              >
                <div className="checkbox flex mr-4">
                  <input
                    type="checkbox"
                    className="w-6 h-6 accent-lime-500 hover:accent-lime-700"
                    checked={task.completed}
                    onChange={() => {}}
                  />
                </div>
                <div className="grow text-left">{task.text}</div>
                <div className="flex flex-row ml-4">
                  <PencilSquareIcon className="invisible group-hover:visible w-6 h-6 mr-2 text-blue-400 hover:text-blue-600" />
                  <XMarkIcon className="invisible group-hover:visible w-6 h-6 text-red-400 hover:text-red-600" />
                </div>
              </div>
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
            <button className="group flex flex-row items-center hover:text-lime-800">
              <CheckIcon className="w-4 h-4 mr-2 text-lime-600 group-hover:text-lime-800" />
              Mark all as completed
            </button>
          </div>
          <div className="flex-1 text-right">
            <button className="group flex flex-row place-self-end items-center hover:text-lime-800">
              <TrashIcon className="w-4 h-4 mr-2 text-lime-600 group-hover:text-lime-800" />
              Clear completed
            </button>
          </div>
        </div>
      </footer>
    </section>
  )
}
