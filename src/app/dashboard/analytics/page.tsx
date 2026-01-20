"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
import { useGetTasksQuery } from "@/lib/api/taskApi";
import { useGetWorkflowsQuery } from "@/lib/api/workflowApi";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [workflowFilter, setWorkflowFilter] = useState("all");

  const { data: tasksData, isLoading: tasksLoading } = useGetTasksQuery({
    limit: 100,
    page: 1,
  });

  const { data: workflowsData } = useGetWorkflowsQuery();

  const tasks = tasksData?.data || [];
  const workflows = workflowsData?.data || [];

  // Calculate analytics data
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completedAt).length;
  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completedAt) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  const inProgressTasks = tasks.filter(
    (task) => !task.completedAt && !overdueTasks,
  ).length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Tasks by priority
  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "high",
  ).length;
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "medium",
  ).length;
  const lowPriorityTasks = tasks.filter(
    (task) => task.priority === "low",
  ).length;

  // Average completion time
  const completedTasksWithDates = tasks.filter(
    (task) => task.completedAt && task.createdAt,
  );
  const avgCompletionTime =
    completedTasksWithDates.length > 0
      ? completedTasksWithDates.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.completedAt!);
          const diffDays =
            (completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return acc + diffDays;
        }, 0) / completedTasksWithDates.length
      : 0;

  // Tasks by workflow stage
  const getTasksByStage = () => {
    const stageCounts: Record<string, number> = {};
    tasks.forEach((task) => {
      stageCounts[task.currentStage] =
        (stageCounts[task.currentStage] || 0) + 1;
    });
    return stageCounts;
  };

  const stageCounts = getTasksByStage();

  if (tasksLoading) {
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

        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track performance and productivity metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>

          <Select value={workflowFilter} onValueChange={setWorkflowFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Workflows" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              {workflows.map((workflow) => (
                <SelectItem key={workflow._id} value={workflow._id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold mt-2">{totalTasks}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">
                    +12% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <BarChart3 className="h-6 w-6" />
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
                <div className="flex items-center mt-1">
                  {completionRate > 70 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">On track</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-xs text-amber-600">
                        Needs improvement
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Avg. Completion Time
                </p>
                <p className="text-2xl font-bold mt-2">
                  {avgCompletionTime.toFixed(1)} days
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-xs text-gray-600">Per task</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <Clock className="h-6 w-6" />
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
                <div className="flex items-center mt-1">
                  {overdueTasks > 5 ? (
                    <span className="text-xs text-red-600">
                      Attention needed
                    </span>
                  ) : (
                    <span className="text-xs text-green-600">
                      Under control
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of tasks by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{completedTasks}</span>
                      <span className="text-sm text-gray-500">
                        {totalTasks > 0
                          ? `${Math.round((completedTasks / totalTasks) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                      <span>In Progress</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{inProgressTasks}</span>
                      <span className="text-sm text-gray-500">
                        {totalTasks > 0
                          ? `${Math.round((inProgressTasks / totalTasks) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Overdue</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{overdueTasks}</span>
                      <span className="text-sm text-gray-500">
                        {totalTasks > 0
                          ? `${Math.round((overdueTasks / totalTasks) * 100)}%`
                          : "0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Distribution</CardTitle>
                <CardDescription>
                  Tasks categorized by priority level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">High Priority</span>
                      <span className="text-sm">{highPriorityTasks} tasks</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(highPriorityTasks / totalTasks) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">
                        Medium Priority
                      </span>
                      <span className="text-sm">
                        {mediumPriorityTasks} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500"
                        style={{
                          width: `${(mediumPriorityTasks / totalTasks) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">Low Priority</span>
                      <span className="text-sm">{lowPriorityTasks} tasks</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(lowPriorityTasks / totalTasks) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stage Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Workflow Stage Breakdown</CardTitle>
              <CardDescription>
                Tasks distributed across workflow stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stageCounts).map(([stageId, count]) => {
                  // Find stage name from workflows
                  let stageName = "Unknown Stage";
                  workflows.forEach((workflow) => {
                    const stage = workflow.stages.find((s) => s.id === stageId);
                    if (stage) stageName = stage.name;
                  });

                  return (
                    <div
                      key={stageId}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span>{stageName}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{count} tasks</span>
                        <span className="text-sm text-gray-500">
                          {totalTasks > 0
                            ? `${Math.round((count / totalTasks) * 100)}%`
                            : "0%"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>
                Key performance indicators over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Completion Rate Trend</h4>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Chart visualization coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Task Velocity</h4>
                    <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-600">
                          Chart visualization coming soon
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Performance</CardTitle>
              <CardDescription>
                Efficiency across different workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {workflows.map((workflow) => {
                  const workflowTasks = tasks.filter(
                    (task) => task.workflowId === workflow._id,
                  );
                  const completed = workflowTasks.filter(
                    (task) => task.completedAt,
                  ).length;
                  const rate =
                    workflowTasks.length > 0
                      ? Math.round((completed / workflowTasks.length) * 100)
                      : 0;

                  return (
                    <div key={workflow._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{workflow.name}</h4>
                          <p className="text-sm text-gray-600">
                            {workflow.description}
                          </p>
                        </div>
                        <Badge
                          variant={workflow.isDefault ? "default" : "outline"}
                        >
                          {workflow.isDefault ? "Default" : "Custom"}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {workflowTasks.length}
                          </p>
                          <p className="text-sm text-gray-600">Total Tasks</p>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold">{rate}%</p>
                          <p className="text-sm text-gray-600">
                            Completion Rate
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {workflow.stages.length}
                          </p>
                          <p className="text-sm text-gray-600">Stages</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>
                Individual contributions and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Team Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Team performance tracking will be available when you add more
                  team members.
                </p>
                <Button>Invite Team Members</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations</CardTitle>
          <CardDescription>Insights based on your analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overdueTasks > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">
                    Address Overdue Tasks
                  </p>
                  <p className="text-sm text-red-600">
                    You have {overdueTasks} overdue tasks. Consider reassigning
                    or adjusting deadlines.
                  </p>
                </div>
              </div>
            )}

            {completionRate < 70 && (
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">
                    Improve Completion Rate
                  </p>
                  <p className="text-sm text-amber-600">
                    Your completion rate is {completionRate}%. Focus on
                    completing more tasks to reach the 70% target.
                  </p>
                </div>
              </div>
            )}

            {highPriorityTasks > 5 && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    High Priority Load
                  </p>
                  <p className="text-sm text-blue-600">
                    You have {highPriorityTasks} high priority tasks. Consider
                    distributing workload or adjusting priorities.
                  </p>
                </div>
              </div>
            )}

            {totalTasks === 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Get Started</p>
                  <p className="text-sm text-green-600">
                    Create your first task to start tracking productivity and
                    performance metrics.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
