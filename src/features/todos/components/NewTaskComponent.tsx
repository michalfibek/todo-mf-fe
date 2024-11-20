type NewTaskComponentProps = {
  taskText: string
  handleChangeTaskText: (text: string) => void
  handleAddTask: () => void
  isDisabled: boolean
}

export const NewTaskComponent = ({
  taskText,
  handleChangeTaskText,
  handleAddTask,
  isDisabled = false,
}: NewTaskComponentProps): JSX.Element => {
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
        onChange={e => handleChangeTaskText(e.target.value)}
        className="block w-full px-4 py-2 text-gray-900 border border-gray-400 rounded-lg bg-gray-50 text-base"
        placeholder="Buy new coffee beans"
        disabled={isDisabled}
        autoFocus
      />
      <button
        type="submit"
        className="px-4 py-2 border border-purple-400 bg-purple-200 hover:bg-purple-400 rounded-lg"
        disabled={isDisabled}
      >
        Add
      </button>
    </form>
  )
}
