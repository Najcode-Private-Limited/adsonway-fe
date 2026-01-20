import NavbarItem from "@/components/navbar/navbar_item";
import PaymentTable from "./components/PaymentTable";
import CustomActionMenu from "@/components/custom_action";
import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import AddPaymentDialog from "./components/AddPaymentDialog";

const Payment = () => {
    const [title, setTitle] = useState("All Payments");
    const [paymentsLength, setPaymentsLength] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [editId, setEditId] = useState(null);
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

    const breadcrumbs = [{ title: "Payment", isNavigation: true }];

    const onRowsPerPageChange = (newRowsPerPage) => {
        setParams((prev) => ({
            ...prev,
            per_page: newRowsPerPage,
        }));
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

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
        }));
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col">
            <NavbarItem
                title="Payment"
                breadcrumbs={breadcrumbs}
            />
            <div className="px-4 space-y-4">
                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <CustomActionMenu
                        title={title}
                        total={paymentsLength}
                        onAdd={handleAdd}
                        disableAdd={false}
                        searchText={searchText}
                        handleSearch={handleSearch}
                        onRowsPerPageChange={onRowsPerPageChange}
                        showRowSelection={false}
                        rowsPerPage={params.per_page}
                        disableBulkExport={true}
                    />
                    <PaymentTable
                        setPaymentsLength={setPaymentsLength}
                        params={params}
                        setParams={setParams}
                        onEdit={handleEdit}
                    />
                </div>
            </div>
            <AddPaymentDialog open={openDialog} setOpen={handleCloseDialog} editId={editId} />
        </div>
    );
};

export default Payment;
