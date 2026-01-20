"use client";

import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import {
  LayoutDashboard,
  ClipboardList,
  Workflow,
  BarChart3,
  Users,
  Settings,
  Bell,
  Calendar,
  Folder,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state: RootState) => state.auth);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mainNavItems = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      label: "Tasks",
      icon: <ClipboardList className="h-5 w-5" />,
      path: "/dashboard/tasks",
    },
    {
      label: "Workflows",
      icon: <Workflow className="h-5 w-5" />,
      path: "/dashboard/workflows",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/dashboard/analytics",
    },
    {
      label: "Team",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/team",
    },
  ];

  const bottomNavItems = [
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/settings",
    },
    {
      label: "Help",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/dashboard/help",
    },
  ];

  if (!mounted) {
    return (
      <aside className="w-64 bg-white border-r min-h-screen sticky top-0">
        <div className="p-4 border-b h-16"></div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r min-h-screen transition-all duration-300 sticky top-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Workflow className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">TaskFlow</h1>
                <p className="text-xs text-gray-500">Smart Task Manager</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="flex justify-center w-full">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Workflow className="h-6 w-6 text-white" />
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <>
          {!collapsed ? (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <p className="text-xs font-medium text-blue-600 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b flex justify-center">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p
          className={cn(
            "text-xs font-semibold text-gray-500 mb-2",
            collapsed && "text-center",
          )}
        >
          {collapsed ? "···" : "MAIN"}
        </p>
        {mainNavItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"}
              onClick={() => router.push(item.path)}
              className={cn(
                "w-full justify-start",
                collapsed && "justify-center p-0 h-10 w-10",
              )}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-blue-500"></div>
                )}
              </div>
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t space-y-1">
        <p
          className={cn(
            "text-xs font-semibold text-gray-500 mb-2",
            collapsed && "text-center",
          )}
        >
          {collapsed ? "···" : "OTHER"}
        </p>
        {bottomNavItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => router.push(item.path)}
            className={cn(
              "w-full justify-start",
              collapsed && "justify-center p-0 h-10 w-10",
            )}
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Button>
        ))}
      </div>
    </aside>
  );
}
