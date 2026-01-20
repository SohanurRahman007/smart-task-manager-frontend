import { api } from "./apiSlice";

export interface AnalyticsData {
  byCompletion: Array<{ _id: string; count: number }>;
  byPriority: Array<{ _id: string; count: number }>;
  byStage: Array<{ _id: string; count: number }>;
  overdue: Array<{ count: number }>;
  avgCompletionTime: Array<{
    avgDays: number;
    minDays: number;
    maxDays: number;
  }>;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    created: number;
    completed: number;
  }>;
  workflowStats: Array<{
    _id: string;
    name: string;
    isDefault: boolean;
    stageCount: number;
    taskCount: number;
    completedTasks: number;
  }>;
}

export interface UserAnalytics {
  _id: string;
  name: string;
  email: string;
  role: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export const analyticsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTaskAnalytics: builder.query<
      { success: boolean; data: AnalyticsData },
      void
    >({
      query: () => "/analytics/overview",
      providesTags: ["Analytics"],
    }),

    getUserAnalytics: builder.query<
      { success: boolean; data: UserAnalytics[] },
      void
    >({
      query: () => "/analytics/users",
      providesTags: ["Analytics"],
    }),
  }),
});

export const { useGetTaskAnalyticsQuery, useGetUserAnalyticsQuery } =
  analyticsApi;
