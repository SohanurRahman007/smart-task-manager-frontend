"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Edit,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
import {
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useUpdateTaskStageMutation,
  useDeleteTaskMutation,
} from "@/lib/api/taskApi";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState("");

  const { data: taskData, isLoading } = useGetTaskByIdQuery(taskId);
  const [updateTask] = useUpdateTaskMutation();
  const [updateStage] = useUpdateTaskStageMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const task = taskData?.data;

  const handleStageChange = async (stageId: string) => {
    try {
      await updateStage({ id: taskId, stageId }).unwrap();
    } catch (error) {
      console.error("Failed to update stage:", error);
    }
  };

  const handleSave = async () => {
    try {
      await updateTask({
        id: taskId,
        data: { description },
      }).unwrap();
      setEditing(false);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId).unwrap();
        router.push("/dashboard/tasks");
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Task not found
        </h2>
        <p className="text-gray-600 mb-6">
          The task you're looking for doesn't exist.
        </p>
        <Button onClick={() => router.push("/dashboard/tasks")}>
          Back to Tasks
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/tasks")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className={getPriorityColor(task.priority)}>
                {task.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline">ID: {task._id.substring(0, 8)}</Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit className="mr-2 h-4 w-4" />
            {editing ? "Cancel" : "Edit"}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
              {editing && (
                <CardDescription>Edit the task description</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <Textarea
                    value={description || task.description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Enter task description..."
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setEditing(false)}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {task.description || "No description provided."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent activities on this task</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {task.creator?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">
                        {task.creator?.name || "User"}
                      </span>{" "}
                      created this task
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(task.createdAt), "MMM d, yyyy HH:mm")}
                    </p>
                  </div>
                </div>
                {task.completedAt && (
                  <div className="flex items-start space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-600">
                        ✓
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">Task was completed</p>
                      <p className="text-xs text-gray-500">
                        {format(
                          new Date(task.completedAt),
                          "MMM d, yyyy HH:mm",
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stage Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Current Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={task.currentStage}
                onValueChange={handleStageChange}
              >
                <SelectTrigger>
                  <SelectValue>
                    {task.workflow?.stages?.find(
                      (s) => s.id === task.currentStage,
                    )?.name || "Unknown Stage"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {task.workflow?.stages?.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Workflow</p>
                <p className="text-sm text-gray-600">
                  {task.workflow?.name || "Unknown"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Due Date:</span>
                  <span className="ml-2">
                    {task.dueDate
                      ? format(new Date(task.dueDate), "MMM d, yyyy")
                      : "Not set"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Created By:</span>
                  <span className="ml-2">
                    {task.creator?.name || "Unknown"}
                  </span>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Created:</span>
                  <span className="ml-2">
                    {format(new Date(task.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
