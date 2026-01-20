import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getItem } from "@/utils/local_storage";
import { format } from "date-fns";

import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import AdApplicationTable from "./components/AdApplicationTable";
import ApplyAdApplicationDialog from "./components/ApplyAdApplicationDialog";
import UpdateApplicationSettingsDialog from "./components/UpdateApplicationSettingsDialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

const FacebookAdApplication = () => {
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [params, setParams] = useState({
        page: 1,
        limit: 25,
        startDate: undefined,
        endDate: undefined,
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [updateSettingsOpen, setUpdateSettingsOpen] = useState(false);

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

    const userRole = getItem("userRole");

    const pageTitle = "Facebook Application";
    const breadcrumbs = [{ title: pageTitle, isNavigation: true }];
    const navigate = useNavigate();

    const onAdd = () => {
        setOpenDialog(true);
    };


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
                    disableAdd={userRole !== "user"}
                    onAdd={onAdd}
                    showDateRangePicker={true}
                    handleDateRangeChange={handleDateRangeChange}
                >
                    {userRole === "admin" && (
                        <Button
                            onClick={() => setUpdateSettingsOpen(true)}
                            className="flex items-center gap-2 cursor-pointer"
                        >
                            <Settings className="w-4 h-4" />
                            <span>Update Settings</span>
                        </Button>
                    )}
                </CustomActionMenu>

                <AdApplicationTable
                    setTotalRecords={setTotalRecords}
                    params={params}
                    onPageChange={onPageChange}
                />

                <ApplyAdApplicationDialog
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    onSuccess={() => {
                        setParams(prev => ({ ...prev }));
                    }}
                />

                <UpdateApplicationSettingsDialog
                    open={updateSettingsOpen}
                    onOpenChange={setUpdateSettingsOpen}
                />
            </div>
        </div>
    );
};

export default FacebookAdApplication;
