import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export interface Task {
  id: string
  text: string
  completed: boolean
  createdDate: number
  completedDate: number
}

export const todoSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  endpoints: builder => ({
    getTasks: builder.query<Task[], void>({
      query: () => "/tasks",
    }),
  }),
})

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetTasksQuery } = todoSlice
