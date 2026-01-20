"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardList, Workflow, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const stats = [
    {
      label: "Total Tasks",
      value: "0",
      icon: <ClipboardList className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active Workflows",
      value: "1",
      icon: <Workflow className="h-5 w-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Team Members",
      value: "1",
      icon: <Users className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Completion Rate",
      value: "0%",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const quickActions = [
    {
      label: "Create Task",
      description: "Add a new task to workflow",
      action: () => router.push("/dashboard/tasks?create=true"),
    },
    {
      label: "View Workflows",
      description: "Manage your workflows",
      action: () => router.push("/dashboard/workflows"),
    },
    {
      label: "Check Analytics",
      description: "View performance metrics",
      action: () => router.push("/dashboard/analytics"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks you might want to perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Card
                key={action.label}
                className="cursor-pointer hover:bg-gray-50"
              >
                <CardContent className="pt-6" onClick={action.action}>
                  <h3 className="font-semibold text-lg mb-2">{action.label}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>No recent activity yet</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/dashboard/tasks")}
            >
              View All Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
