import { ChevronRight, Globe } from "@/icons/icon";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const LanguageMenu = () => {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"ghost"}
            className={"justify-between py-4.5"}
          >
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
          "absolute left-5 -bottom-10 max-h-70 w-50 gap-1 p-1 overflow-y-scroll custom-scrollbar"
        }
      >
        <Button variant={"ghost"} className={"justify-start"}>
          English
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Uzbek
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Русский
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Español
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Português
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Türkçe
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          العربية
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Deutsch
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Français
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          Italiano
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          日本語
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          한국어
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          简体中文
        </Button>
        <Button variant={"ghost"} className={"justify-start"}>
          हिन्दी
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default LanguageMenu;
