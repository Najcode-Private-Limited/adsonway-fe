import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { format } from "date-fns";
import { fetchTransactions } from "../helpers/fetchTransactions";

const TransactionsTable = ({ setTransactionsLength, params, onPageChange }) => {
    const {
        data: transactionsRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["transactions", params],
        queryFn: () => fetchTransactions({ params }),
    });

    const transactions = transactionsRes?.ledgers || [];
    const totalTransactions = transactions?.length || 0;
    const apiTotalPages = transactionsRes?.totalPages || 1;

    useEffect(() => {
        if (setTransactionsLength) {
            setTransactionsLength(transactions.length);
        }
    }, [transactions.length, setTransactionsLength]);


    const columns = [
        {
            key: "userId",
            label: "User",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="font-medium text-white">
                        {value?.full_name || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-sm">
                        @{value?.username || "N/A"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "type", // 'type' field from API
            label: "Type",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium uppercase ${value === "credit" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                    {value || "N/A"}
                </span>
            ),
        },
        {
            key: "amount",
            label: "Amount",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    {/* Assuming currency is USD/$ for now as it's not in the specific ledger object, can check walletId if populated */}
                    <Typography variant="p" className="text-white font-semibold">
                        $ {value?.toLocaleString() || "0"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "balanceAfter",
            label: "New Balance",
            render: (value) => (
                <Typography variant="p" className="text-gray-400 text-sm">
                    $ {value?.toLocaleString() || "0"}
                </Typography>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${value === "completed" ? "bg-teal-500/20 text-teal-400" :
                    value === "failed" ? "bg-red-500/20 text-red-400" :
                        "bg-yellow-500/20 text-yellow-400"
                    } capitalize`}>
                    {value || "pending"}
                </span>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (value) => (
                <Typography className="text-gray-400 text-sm max-w-[200px] truncate" title={value}>
                    {value || "---"}
                </Typography>
            ),
        },
        {
            key: "createdAt",
            label: "Date",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    <Typography className="text-sm">
                        {value ? format(new Date(value), "dd/MM/yyyy") : "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-xs text-nowrap">
                        {value ? format(new Date(value), "hh:mm a") : ""}
                    </Typography>
                </div>
            ),
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={transactions}
            isLoading={isLoading}
            error={error}
            emptyStateMessage="No transactions found"
            perPage={params.per_page}
            currentPage={params.page}
            totalPages={apiTotalPages}
            onPageChange={onPageChange}
        />
    );
};

export default TransactionsTable;
