import { useEffect, useRef, useState } from "react"
import { useAddTaskMutation } from "../todoSlice"

export const NewTaskComponent = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [taskText, setTaskText] = useState("")
  const [addTask, { isLoading: isAddTaskLoading }] = useAddTaskMutation()

  const disabled = isAddTaskLoading

  const handleAddTask = async () => {
    const taskTrimmed = taskText.trim()
    if (taskTrimmed) {
      const response = await addTask(taskTrimmed)
      setTaskText("")
    }
  }

  // re-focus
  useEffect(() => {
    inputRef.current?.focus()
  }, [isAddTaskLoading])

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
        ref={inputRef}
        value={taskText}
        onChange={e => setTaskText(e.target.value)}
        placeholder="Buy new coffee beans"
        disabled={disabled}
        autoFocus
        className="block w-full px-4 py-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-base"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 border border-purple-400 bg-purple-200 hover:bg-purple-400 rounded-lg"
      >
        Add
      </button>
    </form>
  )
}
