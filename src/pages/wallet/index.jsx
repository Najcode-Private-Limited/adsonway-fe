import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import WalletTable from "./components/WalletTable";
import AddTopUpRequestDialog from "./components/AddTopUpRequestDialog";
import { getItem } from "@/utils/local_storage";

const Wallet = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [editId, setEditId] = useState(null);
    const [walletsLength, setWalletsLength] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [params, setParams] = useState({
        page: 1,
        per_page: 25,
        search: "",
        start_date: undefined,
        end_date: undefined,
    });

    const userRole = getItem("userRole");
    const pageTitle = (userRole === "admin" || userRole === "agent") ? "User Topup Request" : "Top-up Requests";

    const debouncedSearch = useDebounce(searchText, 500);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const handleAdd = () => {
        setEditId(null);
        setOpenDialog(true);
    };

    const handleEdit = (id) => {
        setEditId(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = (open) => {
        setOpenDialog(open);
        if (!open) {
            setEditId(null);
        }
    };

    const onRowsPerPageChange = (newRowsPerPage) => {
        setParams((prev) => ({
            ...prev,
            per_page: newRowsPerPage,
        }));
    };

    const breadcrumbs = [{ title: pageTitle, isNavigation: true }];

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
        }));
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col">
            <NavbarItem
                title={pageTitle}
                breadcrumbs={breadcrumbs}
            />

            <div className="px-4 space-y-4">
                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <CustomActionMenu
                        title={pageTitle}
                        total={walletsLength}
                        onAdd={handleAdd}
                        searchText={searchText}
                        handleSearch={handleSearch}
                        onRowsPerPageChange={onRowsPerPageChange}
                        showRowSelection={true}
                        rowsPerPage={params.per_page}
                        disableBulkExport={true}
                        disableAdd={userRole !== "user"}
                    />
                    <WalletTable
                        setWalletsLength={setWalletsLength}
                        params={params}
                        setParams={setParams}
                        onEdit={handleEdit}
                    />
                </div>
            </div>

            <AddTopUpRequestDialog
                open={openDialog}
                setOpen={handleCloseDialog}
                editId={editId}
            />
        </div>
    );
};

export default Wallet;
