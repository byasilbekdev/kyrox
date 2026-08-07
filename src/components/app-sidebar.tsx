"use client";

import SidebarToggle from "./sidebar-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import { AppPopover } from "./app-popover/app-popover";
import { Separator } from "@/components/ui/separator";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Images,
  MessageSquarePlus,
  MessagesSquare,
  Search,
} from "@/icons/icon";

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="flex-row items-center justify-between">
        {state === "expanded" && (
          <Link href={"/"} className="text-lg font-bold font-mono">
            Asiliko
          </Link>
        )}
        <div className="flex items-center gap-2">
          {state === "expanded" && (
            <Button variant={"ghost"} size={"icon"} aria-label="Search">
              <Search className="size-4.5" />
            </Button>
          )}
          <SidebarToggle className={"cursor-w-resize"} />
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex flex-col min-h-0 overflow-hidden">
        <SidebarGroup className="shrink-0 flex flex-col gap-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href={"/"}>
                <SidebarMenuButton>
                  <MessageSquarePlus className="size-4.5" />{" "}
                  {state === "expanded" && "New chat"}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <Link href={"/images"}>
                <SidebarMenuButton>
                  {" "}
                  <Images className="size-4.5" />{" "}
                  {state === "expanded" && "Images"}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <MessagesSquare className="size-4.5" />{" "}
                {state === "expanded" && "Chats"}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {state === "expanded" && (
          <SidebarGroup className="min-h-0 flex-1 overflow-y-scroll custom-scrollbar"></SidebarGroup>
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <AppPopover />
      </SidebarFooter>
    </Sidebar>
  );
}
