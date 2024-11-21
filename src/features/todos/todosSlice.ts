import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit"

import {
  createApi,
  type fetchBaseQuery,
  type FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react"

export type TaskId = string
export type TaskText = string

export type Task = {
  id: TaskId
  text: TaskText
  completed: boolean
  createdDate: number
  completedDate: number
}

type QueryTypes = {
  dispatch: ThunkDispatch<any, any, UnknownAction>
  queryFulfilled: Promise<{
    data: Task
    meta: FetchBaseQueryMeta | undefined
  }>
}

export const todoSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Task"],
  endpoints: builder => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      providesTags: (result, error, arg) =>
        result
          ? [...result.map(({ id }) => ({ type: "Task" as const, id })), "Task"]
          : ["Task"],
    }),
    getCompletedTasks: builder.query<Task[], void>({
      query: () => "/tasks/completed",
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
    markComplete: builder.mutation<Task, TaskId>({
      query: id => ({
        url: `tasks/${id}/complete`,
        method: "POST",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
    }),
    markIncomplete: builder.mutation<Task, TaskId>({
      query: id => ({
        url: `tasks/${id}/incomplete`,
        method: "POST",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
    }),
    editTask: builder.mutation<Task, { id: TaskId; taskText: TaskText }>({
      query: ({ id, taskText }) => ({
        url: `tasks/${id}`,
        method: "POST",
        body: { text: taskText },
      }),
      onQueryStarted: ({ id, taskText }, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<Task, TaskId>({
      query: id => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        removeTaskFromCache(id, { dispatch, queryFulfilled }),
    }),
  }),
})

async function updateTaskInCache({ dispatch, queryFulfilled }: QueryTypes) {
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
  id: TaskId,
  { dispatch, queryFulfilled }: QueryTypes,
) {
  try {
    const patchResult = dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        const taskIndex = draft.findIndex(task => task.id === id)
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
  { dispatch, queryFulfilled }: QueryTypes,
) {
  try {
    const { data: newTask } = await queryFulfilled
    await dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        draft.unshift(newTask)
      }),
    )
  } catch (err) {
    console.error(err)
  }
}

export const {
  useGetTasksQuery,
  useGetCompletedTasksQuery,
  useAddTaskMutation,
  useMarkCompleteMutation,
  useMarkIncompleteMutation,
  useEditTaskMutation,
  useDeleteTaskMutation,
} = todoSlice
