import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import AdminsTable from "./components/AdminsTable";
import AddAdminDialog from "./components/AddAdminDialog";


const Admin = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [adminsLength, setAdminsLength] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [params, setParams] = useState({
    page: 1,
    per_page: 25,
    search: "",
    start_date: undefined,
    end_date: undefined,
  });

  const debouncedSearch = useDebounce(searchText, 500);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const onAdd = () => {
    setOpenAddDialog(true);
  };

  const onCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const onRowsPerPageChange = (newRowsPerPage) => {
    setParams((prev) => ({
      ...prev,
      per_page: newRowsPerPage,
    }));
  };

  const breadcrumbs = [{ title: "Admins", isNavigation: true }];

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debouncedSearch,
    }));
  }, [debouncedSearch]);

  return (
    <div className="flex flex-col">
      <NavbarItem
        title="Admins"
        breadcrumbs={breadcrumbs}
      />

      <div className="px-4">
        <CustomActionMenu
          title="Admin"
          total={adminsLength}
          onAdd={onAdd}
          searchText={searchText}
          handleSearch={handleSearch}
          onRowsPerPageChange={onRowsPerPageChange}
          showRowSelection={true}
          rowsPerPage={params.per_page}
          disableBulkExport={true}
        />
        <AdminsTable setadminsLength={setAdminsLength} params={params} />

        <AddAdminDialog open={openAddDialog} onClose={onCloseAddDialog} />
      </div>
    </div>
  );
};

export default Admin;

