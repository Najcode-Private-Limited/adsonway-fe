import * as React from "react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const predefinedRanges = {
  "All Time": null,
  "This Week": {
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  },
  "This Month": {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  "This Year": {
    from: startOfYear(new Date()),
    to: endOfYear(new Date()),
  },
};

const rangeLabels = Object.keys(predefinedRanges).concat("Custom");

export function DateRangePicker({ className, onChange }) {
  const [selectedLabel, setSelectedLabel] = React.useState("All Time");
  const [customRange, setCustomRange] = React.useState([null, null]);
  const [open, setOpen] = React.useState(false);

  const displayValue = React.useMemo(() => {
    if (selectedLabel === "All Time") return "All Time";
    if (selectedLabel === "Custom" && customRange[0] && customRange[1])
      return `${format(customRange[0], "LLL dd, y")} - ${format(
        customRange[1],
        "LLL dd, y"
      )}`;
    const range = predefinedRanges[selectedLabel];
    if (range) {
      return `${format(range.from, "LLL dd, y")} - ${format(
        range.to,
        "LLL dd, y"
      )}`;
    }
    return "Pick date range";
  }, [selectedLabel, customRange]);

  React.useEffect(() => {
    if (onChange) {
      if (selectedLabel === "Custom") {
        onChange(
          customRange[0] && customRange[1]
            ? { from: customRange[0], to: customRange[1] }
            : null
        );
      } else {
        onChange(predefinedRanges[selectedLabel] || null);
      }
    }
  }, [selectedLabel, customRange, onChange]);

  return (
    <div className={cn(className)}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${selectedLabel === "All Time" ? "w-[10vw]" : ""
              } justify-between text-left font-normal`}
          >
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{displayValue}</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className={cn(
            "bg-[#0d1117] border-border shadow-2xl z-[100]",
            selectedLabel === "Custom"
              ? "w-fit max-h-[80vh] overflow-auto"
              : "w-[15vw]"
          )}
        >
          <div className="space-y-1 p-1">
            {rangeLabels.map((label) => (
              <DropdownMenuItem
                key={label}
                onSelect={(e) => {
                  setSelectedLabel(label);
                  if (label !== "Custom") {
                    setOpen(false);
                  } else {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "w-full justify-start cursor-pointer",
                  selectedLabel === label ? "bg-blue-500/20 text-blue-400" : "text-gray-400"
                )}
              >
                {label}
              </DropdownMenuItem>
            ))}
            {selectedLabel === "Custom" && (
              <div className="mt-2 border border-border/50 rounded-md p-2 bg-background/50" onPointerDown={(e) => e.stopPropagation()}>
                <DatePicker
                  selectsRange
                  startDate={customRange[0]}
                  endDate={customRange[1]}
                  onChange={(update) => setCustomRange(update)}
                  inline
                  monthsShown={2}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
