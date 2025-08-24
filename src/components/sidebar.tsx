"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  FileText,
  MessageCircleMore,
  Menu,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store/user-store";
import { authApi } from "@/lib/api/auth";
import { handleApiError } from "@/lib/api/api-client";
import { useIsClient } from "@/lib/hooks/use-is-client";
import { cn } from "@/lib/utils";

const sidebarMenuItems = [
  {
    icon: LayoutDashboard,
    href: "/dashboard",
    label: "Dashboard",
  },
  {
    icon: FileText,
    href: "/dashboard/tasks",
    label: "Tasks",
  },
  {
    icon: MessageCircleMore,
    href: "/dashboard/messages",
    label: "Messages",
  },
  {
    icon: Users,
    href: "/dashboard/teams",
    label: "Teams",
  },
  {
    icon: Settings,
    href: "/dashboard/settings",
    label: "Settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { resetUser } = useUserStore();
  const isClient = useIsClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      deleteCookie("token");
      resetUser();
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
      setIsMobileMenuOpen(false);
    },
    onError: (error) => {
      toast.error(handleApiError(error));
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleMenuClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="w-10 h-10 bg-white border border-gray-200 shadow-sm hover:bg-gray-50"
        >
          <Menu size={20} />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-[84px] bg-white border-r border-gray-200 flex-col items-center py-6">
        {/* Logo/Brand */}
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-8">
          <span className="text-white font-medium text-lg">C</span>
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4 flex-1">
          {sidebarMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isClient ? pathname === item.href : false;

            return (
              <button
                key={item.href}
                onClick={() => handleMenuClick(item.href)}
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors group relative",
                  isActive
                    ? "bg-green-100 text-green-600"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )}
                title={item.label}
              >
                <Icon size={20} />

                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-10 h-10 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors group relative"
          title="Logout"
        >
          <LogOut size={20} />

          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </div>
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/20"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-50",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-lg">C</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="w-8 h-8"
            >
              <X size={18} />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = isClient ? pathname === item.href : false;

                return (
                  <button
                    key={item.href}
                    onClick={() => handleMenuClick(item.href)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-green-100 text-green-600"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="font-medium">
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
