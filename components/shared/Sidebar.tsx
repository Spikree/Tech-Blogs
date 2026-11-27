"use client";

import { Bookmark, ChevronsUpDown, FileText, Home, LogOut, PenLine } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

const items = [
  { title: "Home", url: "/home", icon: Home },
  { title: "Write", url: "/createBlog", icon: PenLine },
  { title: "Your blogs", url: "/yourBlogs", icon: FileText },
  { title: "Saved", url: "/savedBlogs", icon: Bookmark },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const close = () => setOpenMobile(false);
  const name = session?.user?.name ?? "";
  const email = session?.user?.email ?? "";

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/home" onClick={close} className="flex items-center gap-2 rounded-md px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">

          <span className="font-semibold tracking-tight">Tech Blogs</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} onClick={close}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                  <UserAvatar name={name} image={session?.user?.image} size="sm" />
                  <span className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-medium">{name || "Account"}</span>
                    {email && <span className="truncate text-xs text-muted-foreground">{email}</span>}
                  </span>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width] min-w-56">
                <DropdownMenuLabel className="font-normal text-muted-foreground">
                  Signed in as {name || email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/", redirect: true })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
