import { useState, useCallback } from "react";
import { format } from "date-fns";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import AdAccountsTable from "./components/AdAccountsTable";

const MyFacebookAccounts = () => {
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

    const pageTitle = "My Facebook Ad Accounts";
    const breadcrumbs = [{ title: pageTitle, isNavigation: true }];

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
                    showRowSelection={true}
                    rowsPerPage={params.limit}
                    disableBulkExport={true}
                    disableAdd={true}
                    showDateRangePicker={true}
                    handleDateRangeChange={handleDateRangeChange}
                />

                <AdAccountsTable
                    setTotalRecords={setTotalRecords}
                    params={params}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default MyFacebookAccounts;
