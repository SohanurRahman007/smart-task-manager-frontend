"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Sidebar from "../../../components/shared/Sidebar";
import DashboardNavbar from "../../../components/shared/DashboardNavbar";
import { initializeAuth } from "@/lib/store/slices/authSlice";
// import Sidebar from "@/components/shared/Sidebar";
// import DashboardNavbar from "@/components/shared/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isAuthenticated, _initialized } = useSelector(
    (state: RootState) => state.auth,
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    // Only redirect if we're on client, auth is initialized, and user is not authenticated
    if (isClient && _initialized && !isAuthenticated) {
      // Don't redirect from login/register pages
      if (!pathname.includes("/auth/")) {
        router.push("/auth/login");
      }
    }
  }, [isClient, _initialized, isAuthenticated, router, pathname]);

  // Show loading while checking auth
  if (!isClient || !_initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show nothing (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <DashboardNavbar />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
