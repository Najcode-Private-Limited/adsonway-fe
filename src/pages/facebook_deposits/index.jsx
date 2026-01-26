import { useState, useCallback } from "react";
import { format } from "date-fns";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import FacebookDepositsTable from "./components/FacebookDepositsTable";
import AddDepositDialog from "./components/AddDepositDialog";

const FacebookDeposits = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [params, setParams] = useState({
        page: 1,
        limit: 25,
        startDate: undefined,
        endDate: undefined,
    });

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const onRowsPerPageChange = (newRowsPerPage) => {
        setParams((prev) => ({
            ...prev,
            page: 1,
            limit: newRowsPerPage,
        }));
    };

    const onPageChange = (page) => {
        setParams((prev) => ({
            ...prev,
            page: page + 1,
        }));
    };

    const handleDateRangeChange = useCallback((range) => {
        if (range?.from && range?.to) {
            setParams((prev) => ({
                ...prev,
                startDate: format(range.from, "yyyy-MM-dd"),
                endDate: format(range.to, "yyyy-MM-dd"),
                page: 1,
            }));
        } else {
            setParams((prev) => ({
                ...prev,
                startDate: undefined,
                endDate: undefined,
                page: 1,
            }));
        }
    }, []);

    const pageTitle = "Facebook Deposits";
    const breadcrumbs = [{ title: pageTitle, isNavigation: true }];
    const [isAddDepositOpen, setIsAddDepositOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <NavbarItem
                title={pageTitle}
                breadcrumbs={breadcrumbs}
            />

            <div className="px-4">
                <CustomActionMenu
                    title={pageTitle}
                    total={totalRecords}
                    searchText={searchText}
                    handleSearch={handleSearch}
                    onRowsPerPageChange={onRowsPerPageChange}
                    showRowSelection={false}
                    rowsPerPage={params.limit}
                    disableBulkExport={true}
                    disableAdd={false}
                    onAdd={() => setIsAddDepositOpen(true)}
                    addButtonLabel="Deposit"
                    showDateRangePicker={true}
                    handleDateRangeChange={handleDateRangeChange}
                />

                <FacebookDepositsTable
                    setTotalRecords={setTotalRecords}
                    params={params}
                    onPageChange={onPageChange}
                />

                <AddDepositDialog
                    open={isAddDepositOpen}
                    onOpenChange={setIsAddDepositOpen}
                />
            </div>
        </div>
    );
};

export default FacebookDeposits;
