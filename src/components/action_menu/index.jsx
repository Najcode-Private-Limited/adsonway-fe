import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

const ActionMenu = ({ options = [] }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 p-0">
          <Ellipsis className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 p-1 bg-[#0d1117] border-border shadow-2xl z-[100]"
      >
        {options.map(({ label, icon: Icon, action, className }, index) => (
          <DropdownMenuItem
            key={index}
            onSelect={action}
            className={cn(
              "flex w-full items-center gap-2 p-2 rounded-md text-sm text-gray-400 focus:bg-white/5 focus:text-white cursor-pointer",
              className
            )}
          >
            {Icon && <Icon className="w-4 h-4" />}
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionMenu;
