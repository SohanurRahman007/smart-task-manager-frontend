"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useGetTasksQuery } from "@/lib/api/taskApi";
import { useGetWorkflowsQuery } from "@/lib/api/workflowApi";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Workflow,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  AlertTriangle,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch data using RTK Query
  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({
    limit: 10,
    page: 1,
  });

  const { data: workflowsData, isLoading: workflowsLoading } =
    useGetWorkflowsQuery();

  const isLoading = tasksLoading || workflowsLoading;

  // Calculate stats from tasks
  const tasks = tasksData?.data || [];
  const totalTasks = tasksData?.total || 0;

  // Calculate task status manually
  const completedTasks = tasks.filter((task) => task.completedAt).length;
  const pendingTasks = tasks.filter((task) => !task.completedAt).length;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date() && !task.completedAt;
  }).length;

  const activeWorkflows = workflowsData?.count || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Task status data
  const taskStatus = [
    {
      label: "Completed",
      count: completedTasks,
      color: "bg-green-500",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    {
      label: "In Progress",
      count: pendingTasks,
      color: "bg-blue-500",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Overdue",
      count: overdueTasks,
      color: "bg-red-500",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ];

  // Recent activities from tasks
  const recentActivities = tasks.slice(0, 4).map((task) => ({
    user: task.creator?.name || "You",
    action: task.completedAt ? "completed task" : "created task",
    task: task.title,
    time: formatDistanceToNow(new Date(task.createdAt), { addSuffix: true }),
  }));

  // Quick Actions
  const quickActions = [
    {
      label: "Create New Task",
      description: "Add a new task to workflow",
      icon: <Plus className="h-5 w-5" />,
      action: () => router.push("/dashboard/tasks?create=true"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Design Workflow",
      description: "Create a new workflow process",
      icon: <Workflow className="h-5 w-5" />,
      action: () => router.push("/dashboard/workflows?create=true"),
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {totalTasks > 0
              ? `You have ${totalTasks} tasks, ${overdueTasks} overdue`
              : "No tasks yet. Create your first task!"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            <TrendingUp className="h-3 w-3 mr-1" />
            Tasks: {totalTasks}
          </Badge>
          <Button onClick={() => router.push("/dashboard/tasks")}>
            View All Tasks
          </Button>
        </div>
      </div>

      {/* Stats Grid - SIMPLIFIED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold mt-2">{totalTasks}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Workflows
                </p>
                <p className="text-2xl font-bold mt-2">{activeWorkflows}</p>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <Workflow className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold mt-2">{completionRate}%</p>
              </div>
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Overdue Tasks
                </p>
                <p className="text-2xl font-bold mt-2">{overdueTasks}</p>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Status */}
      <Card>
        <CardHeader>
          <CardTitle>Task Status</CardTitle>
          <CardDescription>Current status of your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {taskStatus.map((status) => (
              <div
                key={status.label}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded ${status.color}`}>
                    {status.icon}
                  </div>
                  <div>
                    <p className="font-medium">{status.label}</p>
                    <p className="text-sm text-gray-500">
                      {status.count} tasks
                    </p>
                  </div>
                </div>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-full rounded-full ${status.color}`}
                    style={{
                      width:
                        totalTasks > 0
                          ? `${(status.count / totalTasks) * 100}%`
                          : "0%",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Quick Actions in Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest task updates</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-blue-600">
                            {activity.task}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No recent activity</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => router.push("/dashboard/tasks?create=true")}
                >
                  Create First Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get things done quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  onClick={action.action}
                  className={`w-full justify-start text-white ${action.color}`}
                >
                  {action.icon}
                  <div className="ml-3 text-left">
                    <p className="font-medium">{action.label}</p>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/tasks")}
                className="w-full justify-start"
              >
                <ClipboardList className="h-5 w-5 mr-3" />
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
