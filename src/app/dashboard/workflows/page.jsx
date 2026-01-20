"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetWorkflowsQuery } from "@/lib/api/workflowApi";
import { Plus, Workflow as WorkflowIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkflowsPage() {
  const router = useRouter();
  const { data: workflowsData, isLoading } = useGetWorkflowsQuery();

  const workflows = workflowsData?.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600">Manage your task workflows</p>
        </div>
        <Button onClick={() => router.push("/dashboard/workflows/create")}>
          <Plus className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : workflows.length === 0 ? (
          <Card className="md:col-span-3">
            <CardContent className="pt-12 pb-12 text-center">
              <WorkflowIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Workflows</h3>
              <p className="text-gray-600 mb-4">
                Create your first workflow to get started
              </p>
              <Button
                onClick={() => router.push("/dashboard/workflows/create")}
              >
                Create Workflow
              </Button>
            </CardContent>
          </Card>
        ) : (
          workflows.map((workflow) => (
            <Card
              key={workflow._id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() =>
                router.push(`/dashboard/workflows/${workflow._id}`)
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  {workflow.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {workflow.description || "No description"}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Stages:</span>
                    <span className="font-medium">
                      {workflow.stages.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Created:</span>
                    <span>
                      {new Date(workflow.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
