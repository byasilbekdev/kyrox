"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import UserInfo from "./user-info";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpRight,
  ChevronRight,
  CircleFadingArrowUp,
  HelpCircle,
  LogOut,
  Settings,
} from "@/icons/icon";
import LanguageMenu from "./language-menu";
import { useSidebar } from "../ui/sidebar";

export function AppPopover() {
  const { state } = useSidebar();
  return (
    <Popover>
      <PopoverTrigger
        className={`${state === "collapsed" ? "p-0 rounded-full" : "h-12"} justify-start`}
        render={<UserInfo />}
      />
      <PopoverContent className="w-61 gap-0.5" side="top">
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <Settings className="size-4.5" />
            Settings
          </p>
        </Button>
        <LanguageMenu />
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <HelpCircle className="size-4.5" />
            Help & Support
          </p>
          <ChevronRight className="size-4.5" />
        </Button>
        <Separator className={"my-1"} />
        <Button variant={"ghost"} className={"justify-between py-4.5"} disabled>
          <p className="flex items-center gap-1">
            <CircleFadingArrowUp className="size-4.5" />
            Upgrade plan
          </p>
          <ArrowUpRight className="size-4.5" />
        </Button>
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <LogOut className="size-4.5" />
            Log out
          </p>
        </Button>
      </PopoverContent>
    </Popover>
  );
}
