"use client";

import { Bookmark, Calendar, Home, Inbox, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "../theme-toggle";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Add Blogs",
    url: "/createBlog",
    icon: Inbox,
  },
  {
    title: "Your Blogs",
    url: "/yourBlogs",
    icon: Calendar,
  },
  {
    title: "Saved Blogs",
    url: "/savedBlogs",
    icon: Bookmark,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const image: string = session?.user?.image ?? "";
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tech Blogs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link
                    href={item.url}
                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-accent ${
                      pathname === item.url ? "bg-accent" : ""
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-10 sm:mb-15">
        
        <DropdownMenu>
          <div className="flex">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start px-4">
                <div className="flex gap-4 items-center">
                  {image ? (
                    <Image
                      src={image}
                      width={30}
                      height={30}
                      alt="Profile picture"
                      className="rounded-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}
                  <p>{session?.user?.name}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <div className="px-4">
          <ModeToggle />
        </div>
          </div>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/", redirect: true })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
