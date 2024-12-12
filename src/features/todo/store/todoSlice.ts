import type { ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import type { TTask, TTaskId, TTaskText } from "../types/TTask";

import { createApi, fetchBaseQuery, type FetchBaseQueryMeta } from "@reduxjs/toolkit/query/react";

type QueryTypes = {
  dispatch: ThunkDispatch<any, any, UnknownAction>;
  queryFulfilled: Promise<{
    data: TTask;
    meta: FetchBaseQueryMeta | undefined;
  }>;
};

export const todoSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  tagTypes: ["Task"],
  endpoints: builder => ({
    getTasks: builder.query<TTask[], void>({
      query: () => "/tasks",
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ id }) => ({ type: "Task" as const, id })), "Task"] : ["Task"],
    }),
    getCompletedTasks: builder.query<TTask[], void>({
      query: () => "/tasks/completed",
    }),
    addTask: builder.mutation<TTask, TTaskText>({
      query: taskText => ({
        url: `tasks`,
        method: "POST",
        body: { text: taskText },
      }),
      onQueryStarted: (taskText, { dispatch, queryFulfilled }) =>
        addTaskToCache(taskText, { dispatch, queryFulfilled }),
    }),
    markComplete: builder.mutation<TTask, TTaskId>({
      query: id => ({
        url: `tasks/${id}/complete`,
        method: "POST",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
    }),
    markIncomplete: builder.mutation<TTask, TTaskId>({
      query: id => ({
        url: `tasks/${id}/incomplete`,
        method: "POST",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
    }),
    editTask: builder.mutation<TTask, { id: TTaskId; taskText: TTaskText }>({
      query: ({ id, taskText }) => ({
        url: `tasks/${id}`,
        method: "POST",
        body: { text: taskText },
      }),
      onQueryStarted: ({ id, taskText }, { dispatch, queryFulfilled }) =>
        updateTaskInCache({ dispatch, queryFulfilled }),
    }),
    deleteTask: builder.mutation<TTask, TTaskId>({
      query: id => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: (id, { dispatch, queryFulfilled }) =>
        removeTaskFromCache(id, { dispatch, queryFulfilled }),
    }),
  }),
});

async function updateTaskInCache({ dispatch, queryFulfilled }: QueryTypes) {
  try {
    const { data: updatedTask } = await queryFulfilled;
    await dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        const taskIndex = draft.findIndex(task => task.id === updatedTask.id);
        if (taskIndex !== -1) {
          draft[taskIndex] = updatedTask;
        }
      }),
    );
  } catch (error) {
    console.log(error);
  }
}

async function removeTaskFromCache(id: TTaskId, { dispatch, queryFulfilled }: QueryTypes) {
  try {
    await queryFulfilled;
    dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        const taskIndex = draft.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          draft.splice(taskIndex, 1);
        }
      }),
    );
  } catch (error) {
    console.log(error);
  }
}

async function addTaskToCache(taskText: TTaskText, { dispatch, queryFulfilled }: QueryTypes) {
  try {
    const { data: newTask } = await queryFulfilled;
    await dispatch(
      todoSlice.util.updateQueryData("getTasks", undefined, draft => {
        draft.unshift(newTask);
      }),
    );
  } catch (err) {
    console.error(err);
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
} = todoSlice;
