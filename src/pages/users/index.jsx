import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import UsersTable from "./components/UsersTable";
import AddUserDialog from "./components/AddUserDialog";
import { getItem } from "@/utils/local_storage";


const Users = () => {
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [usersLength, setUsersLength] = useState(0);
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

    const breadcrumbs = [{ title: "Users", isNavigation: true }];

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
        }));
    }, [debouncedSearch]);

    const userRole = getItem("userRole");
    const canCreateUser = userRole === "agent";

    return (
        <div className="flex flex-col">
            <NavbarItem
                title="Users"
                breadcrumbs={breadcrumbs}
            />

            <div className="px-4">
                <CustomActionMenu
                    title="User"
                    total={usersLength}
                    onAdd={canCreateUser ? onAdd : null}
                    searchText={searchText}
                    handleSearch={handleSearch}
                    onRowsPerPageChange={onRowsPerPageChange}
                    showRowSelection={true}
                    rowsPerPage={params.per_page}
                    disableBulkExport={true}
                />
                <UsersTable setUsersLength={setUsersLength} params={params} />

                <AddUserDialog open={openAddDialog} onClose={onCloseAddDialog} />
            </div>
        </div>
    );
};

export default Users;
