import { ChevronRight, Circle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({ items, showHeader = false, header }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (url) => {
    // For dashboard, use exact match only
    if (url === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    // For other routes, match exact or child routes
    return location.pathname === url || location.pathname.startsWith(url + '/');
  };

  return (
    <SidebarGroup>
      {showHeader && <SidebarGroupLabel className="text-[#8b8f96] text-xs uppercase tracking-wider">{header}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.items.some((subItem) => isActive(subItem.url))}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.items.some((subItem) => isActive(subItem.url))}
                    className="text-white hover:text-white hover:bg-[#3b82f6]/10 data-[active=true]:bg-[#3b82f6]/20 data-[active=true]:text-[#3b82f6] rounded-lg transition-all duration-300"
                  >
                    {item.icon && <item.icon className="w-4 h-4 transition-all duration-300 group-data-[active=true]/collapsible:text-[#3b82f6]" />}
                    <span className="text-xs font-normal group-data-[active=true]/collapsible:font-semibold">{item.title}</span>
                    <ChevronRight className="ml-auto w-4 h-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[active=true]/collapsible:text-[#3b82f6]" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(subItem.url)}
                        >
                          <a
                            onClick={() => navigate(subItem.url)}
                            className={`text-xs cursor-pointer transition-all duration-300 px-2 py-1 rounded-md ${isActive(subItem.url) ? "text-[#3b82f6] font-semibold bg-[#3b82f6]/10" : "text-white hover:text-[#3b82f6] hover:bg-white/5"}`}
                          >
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => navigate(item.url)}
                isActive={isActive(item.url)}
                className="text-white hover:text-white hover:bg-[#3b82f6]/10 data-[active=true]:bg-[#3b82f6]/20 data-[active=true]:text-[#3b82f6] rounded-lg transition-all duration-300"
              >
                {item.icon ? (
                  <item.icon className="w-4 h-4 transition-all duration-300 data-[active=true]:text-[#3b82f6]" />
                ) : (
                  <Circle className="w-3 h-3 transition-all duration-300 data-[active=true]:text-[#3b82f6]" />
                )}
                <span className="text-xs font-normal group-data-[active=true]/collapsible:font-semibold">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

