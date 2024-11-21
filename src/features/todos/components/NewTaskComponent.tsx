import { useState } from "react"
import { useAddTaskMutation } from "../todosSlice"

export const NewTaskComponent = (): JSX.Element => {
  const [taskText, setTaskText] = useState("")
  const [addTask, { isLoading: isAddTaskLoading }] = useAddTaskMutation()

  const disabled = isAddTaskLoading

  const handleAddTask = async () => {
    if (taskText.trim()) {
      const response = await addTask(taskText)
      setTaskText("")
    }
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        handleAddTask()
      }}
      className="flex flex-row space-x-2 mb-4"
    >
      <input
        type="text"
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
        className="block w-full px-4 py-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-base"
        placeholder="Buy new coffee beans"
        disabled={disabled}
        autoFocus
      />
      <button
        type="submit"
        className="px-4 py-2 border border-purple-400 bg-purple-200 hover:bg-purple-400 rounded-lg"
        disabled={disabled}
      >
        Add
      </button>
    </form>
  )
}
