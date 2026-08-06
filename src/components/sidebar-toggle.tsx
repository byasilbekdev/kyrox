"use client";

import { PanelLeftIcon, PanelRightIcon } from "@/icons/icon";
import { Button } from "./ui/button";
import { useSidebar } from "./ui/sidebar";

const SidebarToggle = ({ className }: React.ComponentProps<typeof Button>) => {
  const { open, toggleSidebar } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
      className={className}
    >
      {open ? (
        <PanelLeftIcon className="size-5" />
      ) : (
        <PanelRightIcon className="size-5" />
      )}
    </Button>
  );
};

export default SidebarToggle;
