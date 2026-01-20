import { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import { useDebounce } from "@uidotdev/usehooks";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import TransactionsTable from "./components/TransactionsTable";

const TransactionLog = () => {
    const [totalTransactions, setTotalTransactions] = useState(0);
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

    const onRowsPerPageChange = (newRowsPerPage) => {
        setParams((prev) => ({
            ...prev,
            page: 1, // Reset to first page on size change
            per_page: newRowsPerPage,
        }));
    };

    const onPageChange = (page) => {
        setParams((prev) => ({
            ...prev,
            page: page + 1, // CustomTable typically returns 0-based index
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

    const breadcrumbs = [{ title: "Transaction Log", isNavigation: true }];

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
            page: 1, // Reset to first page on search
        }));
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col">
            <NavbarItem
                title="Transaction Log"
                breadcrumbs={breadcrumbs}
            />

            <div className="px-4">
                <CustomActionMenu
                    title="Transactions"
                    total={totalTransactions}
                    searchText={searchText}
                    handleSearch={handleSearch}
                    onRowsPerPageChange={onRowsPerPageChange}
                    showRowSelection={true}
                    rowsPerPage={params.per_page}
                    disableBulkExport={true}
                    // explicit disableAdd since this is a log
                    disableAdd={true}
                    showDateRangePicker={true}
                    handleDateRangeChange={handleDateRangeChange}
                />



                <TransactionsTable
                    setTransactionsLength={setTotalTransactions}
                    params={params}
                    // We need to pass a way to update page if the table uses CustomTable's pagination
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default TransactionLog;
