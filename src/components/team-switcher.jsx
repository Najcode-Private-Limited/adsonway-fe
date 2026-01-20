import { useEffect, useState } from "react";
import { Crown, ShieldUserIcon, UserIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getItem } from "@/utils/local_storage";

export function TeamSwitcher() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = getItem("userRole");
    console.log("📥 Retrieved role from localStorage:", storedRole);
    setRole(storedRole);
  }, []);

  const getRoleIcon = () => {
    switch (role) {
      case "admin":
        return <ShieldUserIcon className="size-4" />;
      case "agent":
        return <Crown className="size-4" />;
      case "user":
        return <UserIcon className="size-4" />;
      default:
        return <UserIcon className="size-4" />;
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Admin";
      case "agent":
        return "Agent";
      case "user":
        return "User";
      default:
        return role || "User";
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            {getRoleIcon()}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{getRoleLabel()}</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

