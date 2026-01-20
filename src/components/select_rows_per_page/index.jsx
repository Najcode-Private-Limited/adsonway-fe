import Typography from "../typography";
import { SelectDropdown } from "../ui/select-dropdown";

const ROWS_OPTIONS = [25, 50, 75, 100];

const SelectRowsPerPage = ({ onRowsPerPageChange, rowsPerPage }) => {
  return (
    <div className="flex items-center gap-2 ml-2">
      <Typography className="text-sm text-gray-600 dark:text-white whitespace-nowrap">Rows per page:</Typography>
      <SelectDropdown
        options={ROWS_OPTIONS.map(opt => ({ label: String(opt), value: String(opt) }))}
        value={String(rowsPerPage)}
        onValueChange={(val) => {
          if (onRowsPerPageChange) onRowsPerPageChange(Number(val));
        }}
        placeholder={String(rowsPerPage)}
        className="w-20 h-8"
        width="80px"
      />
    </div>
  );
};

export default SelectRowsPerPage;