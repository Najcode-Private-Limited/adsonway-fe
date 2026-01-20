import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { fetchMyAdAccounts } from "../helpers/fetchMyAdAccounts";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewAdAccountDialog from "@/pages/google_accounts/components/ViewAdAccountDialog";

const AdAccountsTable = ({ setTotalRecords, params, onPageChange }) => {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const handleView = (account) => {
        setSelectedAccount(account);
        setViewDialogOpen(true);
    };

    const {
        data: dataRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["myGoogleAccounts", params],
        queryFn: () => fetchMyAdAccounts({ params }),
    });

    const records = dataRes?.accounts || [];
    const totalRecordsCount = dataRes?.totalAccounts || records?.length || 0;
    const apiTotalPages = dataRes?.totalPages || 1;

    useEffect(() => {
        if (setTotalRecords) {
            setTotalRecords(totalRecordsCount);
        }
    }, [totalRecordsCount, setTotalRecords]);

    const columns = [
        {
            key: "account_name",
            label: "Account Name",
            render: (value) => (
                <Typography className="text-gray-300 text-sm font-medium">
                    {value || "N/A"}
                </Typography>
            ),
        },
        {
            key: "account_id",
            label: "Account ID",
            render: (value) => (
                <Typography className="text-gray-400 text-xs text-nowrap">
                    {value || "N/A"}
                </Typography>
            ),
        },
        {
            key: "timezone",
            label: "Time Zone",
            render: (value) => (
                <Typography className="text-gray-400 text-xs">
                    {value || "N/A"}
                </Typography>
            ),
        },
        {
            key: "deposit_amount",
            label: "Amount",
            render: (value) => (
                <Typography className="text-white font-medium text-sm">
                    ${value || "0"}
                </Typography>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize ${value === "active" ? "bg-green-500/20 text-green-400" :
                    value === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                    }`}>
                    {value || "N/A"}
                </span>
            ),
        },
        {
            key: "actions",
            label: "Action",
            render: (_, row) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-zinc-800 text-zinc-400 hover:text-white"
                    onClick={() => handleView(row)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            ),
        },
    ];

    return (
        <>
            <CustomTable
                columns={columns}
                data={records}
                isLoading={isLoading}
                error={error}
                emptyStateMessage="No Google ad accounts found"
                perPage={params.limit}
                currentPage={params.page}
                totalPages={apiTotalPages}
                onPageChange={onPageChange}
            />

            <ViewAdAccountDialog
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                data={selectedAccount}
            />
        </>
    );
};

export default AdAccountsTable;
