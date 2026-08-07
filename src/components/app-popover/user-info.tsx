"use client";

import { ComponentPropsWithoutRef, forwardRef } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

type Props = ComponentPropsWithoutRef<typeof Button>;

const UserInfo = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const { state } = useSidebar();
  return (
    <Button
      variant="outline"
      className={"justify-start h-auto"}
      ref={ref}
      {...props}
    >
      <Image
        src={"/favicon.ico"}
        alt="This is user logo"
        className="rounded-full"
        width={35}
        height={35}
      />
      {state === "expanded" && <p className="font-medium">Asilbek</p>}
    </Button>
  );
});

UserInfo.displayName = "UserInfo";

export default UserInfo;
