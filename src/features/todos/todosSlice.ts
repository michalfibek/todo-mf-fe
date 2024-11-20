import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export type TaskId = string
export type TaskText = string

export type Task = {
  id: TaskId
  text: TaskText
  completed: boolean
  createdDate: number
  completedDate: number
}

export const todoSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Tasks"],
  endpoints: builder => ({
    getTasks: builder.query<Task[], undefined>({
      query: () => "/tasks",
      providesTags: result =>
        result ? result.map(({ id }) => ({ type: "Tasks", id })) : [],
    }),
    addTask: builder.mutation<Task, TaskText>({
      query: taskText => ({
        url: `tasks`,
        method: "POST",
        body: { text: taskText },
      }),
      onQueryStarted: (taskText, { dispatch, queryFulfilled }) =>
        addTaskToCache(taskText, { dispatch, queryFulfilled }),
    }),
    markComplete: builder.mutation<
      Task,
      { taskId: TaskId; taskText: TaskText }
    >({
      query: taskId => ({
        url: `tasks/${taskId}/complete`,
        method: "POST",
      }),
      onQueryStarted: ({ taskId, taskText }, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ taskId, taskText }, { dispatch, queryFulfilled }),
    }),
    markIncomplete: builder.mutation<
      Task,
      { taskId: TaskId; taskText: TaskText }
    >({
      query: taskId => ({
        url: `tasks/${taskId}/incomplete`,
        method: "POST",
      }),
      onQueryStarted: ({ taskId, taskText }, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ taskId, taskText }, { dispatch, queryFulfilled }),
    }),
    editTask: builder.mutation<Task, { taskId: TaskId; taskText: TaskText }>({
      query: ({ taskId, taskText }) => ({
        url: `tasks/${taskId}`,
        method: "POST",
        body: { text: taskText },
      }),
      onQueryStarted: ({ taskId, taskText }, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ taskId, taskText }, { dispatch, queryFulfilled }),
    }),
    deleteTask: builder.mutation<Task, TaskId>({
      query: taskId => ({
        url: `tasks/${taskId}`,
        method: "DELETE",
      }),
      onQueryStarted: (taskId, { dispatch, queryFulfilled }) =>
        removeTaskFromCache({ taskId }, { dispatch, queryFulfilled }),
    }),
  }),
})

async function updateTaskInCache(
  { taskId, taskText }: { taskId: TaskId; taskText: TaskText },
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: AppDispatch
    queryFulfilled: QueryFulfilled<Task, TaskId>
  },
) {
  try {
    const { data: updatedTask } = await queryFulfilled
    await dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        const taskIndex = draft.findIndex(task => task.id === updatedTask.id)
        if (taskIndex !== -1) {
          draft[taskIndex] = updatedTask
        }
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

async function removeTaskFromCache(
  { taskId }: { taskId: TaskId },
  {
    dispatch,
    queryFulfilled,
  }: {
    dispatch: AppDispatch
    queryFulfilled: QueryFulfilled<Task, TaskId>
  },
) {
  try {
    const patchResult = dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        const taskIndex = draft.findIndex(task => task.id === taskId)
        if (taskIndex !== -1) {
          draft.splice(taskIndex, 1)
        }
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

async function addTaskToCache(
  taskText: TaskText,
  { dispatch, queryFulfilled }: QueryLifecycleApi,
) {
  try {
    const { data: newTaskData } = await queryFulfilled
    await dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        draft.unshift(newTaskData)
      }),
    )
  } catch (error) {
    console.log(error)
  }
}

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetTasksQuery,
  useAddTaskMutation,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
} = todoSlice
