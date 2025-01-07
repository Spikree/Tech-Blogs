"use client";

import { Calendar, Home, Inbox, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

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
];

export function AppSidebar() {
  const { data: session } = useSession();
  const image: string = session?.user?.image ?? "";
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tech Blogs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mb-10 sm:mb-15">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex gap-4 px-4 items-center text-center align-middle">
              {image ? (
                <Image
                  src={image}
                  width={30}
                  height={30}
                  alt="Picture of the author"
                  className="rounded-full aspect-square object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full" />
              )}
              <p>{session?.user?.name}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-8 py-4 my-4">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Button
                onClick={() => {
                  signOut({
                    callbackUrl: "/",
                    redirect: true,
                  });
                }}
              >
                SignOut
                <LogOut />
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
