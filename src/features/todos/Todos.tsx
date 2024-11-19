import { useState } from "react"
import styles from "./Todos.module.css"
import {
  CheckIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid"

const mockData = [
  {
    id: "1",
    text: "Task 1",
    completed: false,
    createdDate: 0,
    completedDate: 0,
  },
  {
    id: "2",
    text: "Another task",
    completed: false,
    createdDate: 0,
    completedDate: 0,
  },
  {
    id: "3",
    text: "Task with long description and stuff and long description forced to break into another line",
    completed: true,
    createdDate: 0,
    completedDate: 0,
  },
  {
    id: "4",
    text: "Different task",
    completed: false,
    createdDate: 0,
    completedDate: 0,
  },
]

export const Todos = () => {
  return (
    <section className="flex flex-col border border-gray-300 p-4 rounded-lg text-lg max-w-xl bg-white">
      <div className="mb-4">
        <input
          type="text"
          className="block w-full px-4 py-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-base"
          placeholder="Buy new coffee beans"
        />
      </div>
      <div className="task-filter mt-6 flex flex-row space-x-2 text-sm">
        <button className="active py-1 px-2 border border-lime-400 hover:bg-lime-200 rounded-lg">
          All tasks
        </button>
        <button className="py-1 px-2 hover:bg-lime-200 rounded-lg border border-transparent">
          Active
        </button>
        <button className="py-1 px-2 hover:bg-lime-200 rounded-lg border border-transparent">
          Completed
        </button>
      </div>
      <div className="tasklist flex flex-col">
        <div className="flex flex-row mb-4 text-sm"></div>
        {mockData.map(task => (
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
      <footer className="flex flex-col text-sm text-left mt-8">
        <div className="">1/4 completed</div>
        <div className="flex flex-row pt-6">
          <div className="flex-none text-left">
            <button className="group flex flex-row items-center">
              <CheckIcon className="w-4 h-4 mr-2 text-lime-600 group-hover:text-lime-800" />
              Mark all as completed
            </button>
          </div>
          <div className="flex-1 text-right">
            <button className="group flex flex-row place-self-end items-center">
              <TrashIcon className="w-4 h-4 mr-2 text-lime-600 group-hover:text-lime-800" />
              Clear completed
            </button>
          </div>
        </div>
      </footer>
    </section>
  )
}
