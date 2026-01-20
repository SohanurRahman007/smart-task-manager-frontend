"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft, Save, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useGetWorkflowsQuery } from "@/lib/api/workflowApi";
import { useCreateTaskMutation } from "@/lib/api/taskApi";

export default function CreateTaskPage() {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [loading, setLoading] = useState(false);

  const {
    data: workflowsData,
    isLoading: workflowsLoading,
    error: workflowsError,
  } = useGetWorkflowsQuery();
  const [createTask] = useCreateTaskMutation();

  // Debug logging
  useEffect(() => {
    console.log("Workflows data:", workflowsData);
    console.log("Workflows loading:", workflowsLoading);
    console.log("Workflows error:", workflowsError);
  }, [workflowsData, workflowsLoading, workflowsError]);

  const workflows = workflowsData?.data || [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const taskData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      priority: formData.get("priority") as "low" | "medium" | "high",
      workflowId: formData.get("workflowId") as string,
      dueDate: date ? date.toISOString() : undefined,
      tags: (formData.get("tags") as string)
        ?.split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    console.log("Creating task:", taskData);

    try {
      const result = await createTask(taskData).unwrap();
      console.log("Task created:", result);
      router.push("/dashboard/tasks");
    } catch (error) {
      console.error("Failed to create task:", error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Create New Task
            </h1>
            <p className="text-gray-600">Add a new task to your workflow</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/tasks")}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" form="task-form" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Task Details</CardTitle>
            <CardDescription>
              Enter all the details for your new task
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="task-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Task Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the task in detail..."
                  rows={5}
                />
              </div>

              {/* Priority and Workflow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workflowId">Workflow *</Label>
                  <Select
                    name="workflowId"
                    required
                    disabled={workflowsLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          workflowsLoading
                            ? "Loading workflows..."
                            : "Select workflow"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {workflowsLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading workflows...
                        </SelectItem>
                      ) : workflows.length === 0 ? (
                        <SelectItem value="none" disabled>
                          No workflows available. Create one first.
                        </SelectItem>
                      ) : (
                        workflows.map((workflow) => (
                          <SelectItem key={workflow._id} value={workflow._id}>
                            {workflow.name} {workflow.isDefault && "(Default)"}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {workflowsError && (
                    <p className="text-sm text-red-600">
                      Error loading workflows
                    </p>
                  )}
                  {workflows.length === 0 && !workflowsLoading && (
                    <p className="text-sm text-amber-600">
                      No workflows found. Please create a workflow first.
                    </p>
                  )}
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="frontend, backend, bug, feature (comma separated)"
                />
                <p className="text-xs text-gray-500">
                  Separate tags with commas
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar - Help Info */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Workflow Required</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• You need at least one workflow</li>
                <li>• Go to Workflows page to create</li>
                <li>• Default workflow is recommended</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Need a Workflow?</h3>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/workflows/create")}
              >
                Create Workflow First
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
