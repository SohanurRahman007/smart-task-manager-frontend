import { api } from "./apiSlice";

export interface Task {
  _id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  currentStage: string;
  assignedTo: string[];
  dueDate?: string;
  completedAt?: string;
  workflowId: string;
  projectId: string;
  createdBy: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  workflow?: {
    _id: string;
    name: string;
    stages: Array<{ id: string; name: string }>;
  };
  assignees?: Array<{ _id: string; name: string; email: string }>;
  creator?: { _id: string; name: string; email: string };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  workflowId: string;
  assignedTo?: string[];
  dueDate?: string;
  tags?: string[];
  projectId?: string;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  total: number;
  pages: number;
  currentPage: number;
  data: Task[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: {
    byStage: Array<{ _id: string; count: number }>;
    byPriority: Array<{ _id: string; count: number }>;
    byCompletion: Array<{ _id: string; count: number }>;
    overdue: Array<{ count: number }>;
    avgCompletionTime: Array<{ avgDays: number }>;
  };
}

export const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks with filters
    getTasks: builder.query<
      TasksResponse,
      {
        page?: number;
        limit?: number;
        workflowId?: string;
        stage?: string;
        priority?: string;
        search?: string;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== "") {
            queryParams.append(key, String(value));
          }
        });
        return `/tasks?${queryParams.toString()}`;
      },
      providesTags: ["Task"],
    }),

    // Get task analytics
    getTaskAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => "/tasks/analytics/overview",
      providesTags: ["Analytics"],
    }),

    // Get task by ID
    getTaskById: builder.query<{ success: boolean; data: Task }, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    // Create task
    createTask: builder.mutation<
      { success: boolean; data: Task },
      CreateTaskRequest
    >({
      query: (taskData) => ({
        url: "/tasks",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Task", "Analytics"],
    }),

    // Update task stage
    updateTaskStage: builder.mutation<
      { success: boolean; data: Task },
      { id: string; stageId: string }
    >({
      query: ({ id, stageId }) => ({
        url: `/tasks/${id}/stage`,
        method: "PATCH",
        body: { stageId },
      }),
      invalidatesTags: ["Task", "Analytics"],
    }),

    // Update task
    updateTask: builder.mutation<
      { success: boolean; data: Task },
      { id: string; data: Partial<Task> }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),

    // Delete task
    deleteTask: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task", "Analytics"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskAnalyticsQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskStageMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
