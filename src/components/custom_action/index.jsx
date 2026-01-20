import React from "react";
import Typography from "../typography";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CloudDownload, CloudUpload, PlusIcon } from "lucide-react";
import { singularize } from "@/utils/singularizing_word";
import { capitalize } from "@/utils/captilize";
import { DateRangePicker } from "../date_filter";
import SelectRowsPerPage from "../select_rows_per_page";

const CustomActionMenu = ({
  title,
  total,
  onAdd,
  handleSearch,
  disableAdd = false,
  disableBulkUpload = true,
  searchText,
  setOpenDialog,
  showDateRangePicker = false,
  handleDateRangeChange,
  showRowSelection = false,
  onRowsPerPageChange,
  rowsPerPage = 25,
  disableBulkExport = true,
  onBulkExport,
  children,
}) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between w-full my-3">
      <div>
        <Typography variant="p" className="whitespace-nowrap">
          Showing {total} {title}
        </Typography>
      </div>
      <div className="flex flex-wrap gap-2 md:gap-4 items-center">
        <Input
          placeholder="Search"
          className={`min-w-[150px] ${disableBulkUpload ? "w-80" : "w-48"}`}
          value={searchText}
          onChange={handleSearch}
        />
        {showDateRangePicker && (
          <DateRangePicker onChange={handleDateRangeChange} />
        )}
        {showRowSelection && (
          <SelectRowsPerPage
            onRowsPerPageChange={onRowsPerPageChange}
            rowsPerPage={rowsPerPage}
          />
        )}
        {!disableBulkExport && (
          <Button
            onClick={onBulkExport}
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
          >
            <CloudDownload />
            <span>Bulk Export</span>
          </Button>
        )}
        {!disableBulkUpload && (
          <Button
            onClick={() => setOpenDialog(true)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CloudUpload />
            <span>Bulk Upload</span>
          </Button>
        )}
        {children}
        {!disableAdd && (
          <Button
            onClick={onAdd}
            className="flex items-center gap-2 cursor-pointer"
          >
            <PlusIcon />
            <span>Add {capitalize(singularize(title))}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomActionMenu;
