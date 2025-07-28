"use client";
import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavData } from "./admin-nav-config";
import { logout } from "../../action";
import { Button } from "@/components/ui/button";

export function AppSidebar({ ...props }) {
  const pathname = usePathname();
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-xl">ADMIN PANEL</h1>
          <ThemeSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {adminNavData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.filter(item => !item.hidden).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <form action={logout}>
          <Button variant="destructive">Logout</Button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
