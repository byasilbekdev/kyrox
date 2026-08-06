"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "./ui/separator";
import { useSidebar } from "./ui/sidebar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowUpRight,
  ChevronRight,
  CircleFadingArrowUp,
  Globe,
  HelpCircle,
  LogOut,
  Settings,
} from "@/icons/icon";

export function AppPopover() {
  const { state } = useSidebar();
  return (
    <Popover>
      <PopoverTrigger
        className={
          state === "collapsed" ? "w-auto h-auto p-0 rounded-full" : "p-2"
        }
        render={
          <Button variant="outline" className={"flex-1 justify-start"}>
            <Image
              src={"/favicon.ico"}
              alt="This is user logo"
              className="border overflow-hidden rounded-full"
              width={35}
              height={35}
            />
            {state === "expanded" && (
              <div className="flex flex-col items-start">
                <p className="text-lg">Asilbek</p>
                <span className="text-sm">Free</span>
              </div>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-64.5 gap-0.5" side="top">
        <Button variant={"ghost"} className={"justify-between py-4.5"}>
          <p className="flex items-center gap-1">
            <Settings className="size-4.5" />
            Settings
          </p>
        </Button>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant={"ghost"} className={"justify-between py-4.5"}>
                <p className="flex items-center gap-1">
                  <Globe className="size-4.5" />
                  Language
                </p>
                <ChevronRight className="size-4.5" />
              </Button>
            }
          />
          <PopoverContent
            side="right"
            className={
              "absolute left-5 -bottom-10 max-h-70 overflow-y-scroll custom-scrollbar"
            }
          >
            <p>English</p>
            <p>German</p>
            <p>Uzbek</p>
            <p>Russia</p>
          </PopoverContent>
        </Popover>
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
