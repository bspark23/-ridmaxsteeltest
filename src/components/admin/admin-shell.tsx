"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/auth-slice";
import { AdminNav, hasAnyPermission } from "./admin-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setSidebarOpen } from "@/store/slices/ui-slice";
import { cn } from "@/lib/utils";

function initials(name?: string) {
  const n = (name ?? "").trim();
  if (!n) return "EH";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("");
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector((s) => s.auth);
  const { systemSettings } = useAppSelector((s) => s.content.content);
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);

  const normalizedPathname =
    pathname !== "/" ? pathname.replace(/\/+$/, "") : pathname;

  const canViewDashboard = useMemo(() => {
    return hasAnyPermission(user, ["dashboard:read"]);
  }, [user]);

  useEffect(() => {
    if (loading) return;
    const isSignin = normalizedPathname === "/admin";
    const isAdminPath =
      normalizedPathname === "/admin" ||
      normalizedPathname.startsWith("/admin/");

    if (!isAdminPath) return;

    if (!isAuthenticated) {
      if (!isSignin) router.replace("/admin");
      return;
    }

    if (user?.role !== undefined && user?.role !== "admin") {
      router.replace("/admin");
      return;
    }

    if (isSignin) {
      router.replace(canViewDashboard ? "/admin/dashboard" : "/admin/settings");
    }
  }, [
    canViewDashboard,
    isAuthenticated,
    loading,
    normalizedPathname,
    router,
    user?.role,
  ]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/admin/sw.js", { scope: "/admin/" })
      .catch(() => {});
  }, []);

  return (
    <div className="dark">
      <SidebarProvider
        open={sidebarOpen}
        onOpenChange={(open) => dispatch(setSidebarOpen(open))}
      >
        <Sidebar collapsible="icon" variant="inset" className="bg-sidebar/40">
          <SidebarHeader className="px-2 pt-3">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-sidebar-accent"
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-xl border bg-black/40">
                <Image
                  src="/images/icon.svg"
                  alt={systemSettings?.siteName}
                  fill
                  sizes="36px"
                  className="object-contain p-1.5"
                  priority
                />
              </div>
              <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <h4 className="truncate text-sm font-semibold text-sidebar-foreground">
                  {systemSettings?.siteName ?? ""}
                </h4>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  Admin • {systemSettings?.siteSlogan ?? ""}
                </span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent className="px-2 pb-2">
            <AdminNav user={user} />
          </SidebarContent>

          <SidebarFooter className="px-2 pb-3">
            <Separator className="mx-2 bg-sidebar-border" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 rounded-xl px-2",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user?.avatarUrl ?? "/images/default-avatar.png"}
                      alt={user?.name ?? "User"}
                    />
                    <AvatarFallback>{initials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-1 flex-col items-start group-data-[collapsible=icon]:hidden">
                    <span className="truncate text-sm font-medium leading-tight">
                      {user?.name ?? "Admin"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground leading-tight">
                      {user?.email ?? ""}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    dispatch(logout());
                    router.replace("/admin");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset className="bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.0),rgba(0,0,0,0.0))]">
          <header className="sticky top-2 z-10 w-full max-w-full overflow-x-hidden px-4 md:px-6">
            <div className="mt-2 flex w-full min-w-0 items-center gap-2 rounded-2xl border bg-background/70 px-3 py-2 shadow-[0_14px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="shrink-0 text-white" />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* <div className="relative w-full min-w-0 max-w-md">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                  <Input
                    className="h-9 w-full rounded-full border-border/60 bg-background/60 pl-9 shadow-none text-white"
                    placeholder="Search…"
                  />
                </div> */}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="shrink-0 rounded-full"
                  >
                    <Bell className="h-5 w-5 text-white" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[380px] sm:w-[420px]">
                  <SheetHeader>
                    <SheetTitle>Notifications</SheetTitle>
                    <SheetDescription>
                      Latest updates and alerts.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-3">
                    <div className="rounded-xl border bg-background/60 p-3">
                      <div className="text-sm font-medium text-white">
                        No notifications yet
                      </div>
                      <div className="mt-1 text-xs text-white">
                        System events and operational alerts will appear here.
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
