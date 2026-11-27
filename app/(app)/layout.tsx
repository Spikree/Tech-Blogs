"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/Sidebar";
import { ModeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto flex items-center gap-2">
            {pathname !== "/createBlog" && (
              <Button asChild size="sm">
                <Link href="/createBlog">
                  <PenLine />
                  Write
                </Link>
              </Button>
            )}
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
