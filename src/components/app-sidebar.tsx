"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarToggle from "./sidebar-toggle";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  FolderGit,
  Images,
  MessageSquarePlus,
  MessagesSquare,
  Search,
} from "@/icons/icon";
import { AppPopover } from "./app-popover";
import { Separator } from "@/components/ui/separator";

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
            <Button variant={"ghost"} size={"icon"}>
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
            <SidebarMenuButton>
              <MessageSquarePlus
                className={state === "collapsed" ? "size-4.5" : "size-4.5"}
              />{" "}
              {state === "expanded" && "New chat"}
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuButton>
              <MessagesSquare
                className={state === "collapsed" ? "size-4.5" : "size-4.5"}
              />{" "}
              {state === "expanded" && "Chats"}
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuButton>
              <Images
                className={state === "collapsed" ? "size-4.5" : "size-4.5"}
              />{" "}
              {state === "expanded" && "Images"}
            </SidebarMenuButton>
          </SidebarMenu>
          <SidebarMenu>
            <SidebarMenuButton>
              <FolderGit
                className={state === "collapsed" ? "size-4.5" : "size-4.5"}
              />
              {state === "expanded" && "Projects"}
            </SidebarMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        <Separator />
        {state === "expanded" && (
          <SidebarGroup className="min-h-0 flex-1 overflow-y-scroll custom-scrollbar">
            dfg
          </SidebarGroup>
        )}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <AppPopover />
      </SidebarFooter>
    </Sidebar>
  );
}
