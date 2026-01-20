import { api } from "./apiSlice";

export interface WorkflowStage {
  id: string;
  name: string;
  order: number;
  color: string;
}

export interface Workflow {
  _id: string;
  name: string;
  description: string;
  stages: WorkflowStage[];
  createdBy: string;
  isDefault: boolean;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowsResponse {
  success: boolean;
  count: number;
  data: Workflow[];
}

export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  stages: WorkflowStage[];
  isDefault?: boolean;
  projectId?: string;
}

export const workflowApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all workflows
    getWorkflows: builder.query<WorkflowsResponse, void>({
      query: () => "/workflows",
      providesTags: ["Workflow"],
    }),

    // Get workflow by ID
    getWorkflowById: builder.query<
      { success: boolean; data: Workflow },
      string
    >({
      query: (id) => `/workflows/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Workflow", id }],
    }),

    // Create workflow
    createWorkflow: builder.mutation<
      { success: boolean; data: Workflow },
      CreateWorkflowRequest
    >({
      query: (workflowData) => ({
        url: "/workflows",
        method: "POST",
        body: workflowData,
      }),
      invalidatesTags: ["Workflow"],
    }),

    // Update workflow
    updateWorkflow: builder.mutation<
      { success: boolean; data: Workflow },
      { id: string; data: Partial<Workflow> }
    >({
      query: ({ id, data }) => ({
        url: `/workflows/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Workflow", id }],
    }),

    // Delete workflow
    deleteWorkflow: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/workflows/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Workflow"],
    }),
  }),
});

export const {
  useGetWorkflowsQuery,
  useGetWorkflowByIdQuery,
  useCreateWorkflowMutation,
  useUpdateWorkflowMutation,
  useDeleteWorkflowMutation,
} = workflowApi;
