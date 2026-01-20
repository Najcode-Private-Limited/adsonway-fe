import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function SelectDropdown({ options, value, onValueChange, placeholder, className, disabled, width }) {
    const selectedOption = options.find(opt => opt.value === value)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                        "w-full justify-between font-normal bg-background/50 border-border/50 hover:bg-background/80 hover:border-blue-500/50 transition-all focus:ring-0 focus:ring-offset-0",
                        className
                    )}
                    style={{ width: width || "100%" }}
                >
                    <span className="truncate">
                        {selectedOption ? selectedOption.label : placeholder || "Select..."}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="p-1 bg-[#0d1117] border-border shadow-2xl z-[100] min-w-[var(--radix-dropdown-menu-trigger-width)]"
                align="start"
            >
                <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                    {options.map((option) => (
                        <DropdownMenuItem
                            key={option.value}
                            disabled={option.disabled}
                            className={cn(
                                "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors cursor-pointer",
                                value === option.value
                                    ? "bg-blue-500/20 text-blue-400 focus:bg-blue-500/30 focus:text-blue-300"
                                    : "text-gray-400 focus:bg-white/5 focus:text-white"
                            )}
                            onSelect={() => {
                                if (!option.disabled) {
                                    onValueChange(option.value)
                                }
                            }}
                        >
                            <span className="truncate">{option.label}</span>
                            {value === option.value && <Check className="h-4 w-4" />}
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
