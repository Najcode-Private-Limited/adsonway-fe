import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { fetchMyFacebookDeposits } from "../helpers/fetchMyFacebookDeposits";
import { format } from "date-fns";

const FacebookDepositsTable = ({ setTotalRecords, params, onPageChange }) => {

    const {
        data: dataRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["myFacebookDeposits", params],
        queryFn: () => fetchMyFacebookDeposits({ params }),
    });

    // Adjust these accessors based on actual API response
    const records = dataRes?.requests || [];
    const totalRecordsCount = dataRes?.requests?.length || 0;
    const apiTotalPages = dataRes?.totalPages || 1;

    useEffect(() => {
        if (setTotalRecords) {
            setTotalRecords(totalRecordsCount);
        }
    }, [totalRecordsCount, setTotalRecords]);

    const columns = [
        {
            key: "createdAt",
            label: "Date",
            render: (value) => (
                <Typography className="text-gray-400 text-xs">
                    {value ? format(new Date(value), "PPP p") : "N/A"}
                </Typography>
            ),
        },
        {
            key: "accountId",
            label: "Ad Account",
            render: (value) => (
                <div className="flex flex-col">
                    <Typography className="text-gray-300 text-sm font-medium">
                        {value?.account_name || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-xs">
                        {value?.account_id || ""}
                    </Typography>
                </div>
            ),
        },
        {
            key: "amount",
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
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize ${value === "approved" || value === "completed" || value === "success" ? "bg-green-500/20 text-green-400" :
                    value === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                    }`}>
                    {value || "N/A"}
                </span>
            ),
        },
    ];

    return (
        <CustomTable
            columns={columns}
            data={records}
            isLoading={isLoading}
            error={error}
            emptyStateMessage="No deposit requests found"
            perPage={params.limit}
            currentPage={params.page}
            totalPages={apiTotalPages}
            onPageChange={onPageChange}
        />
    );
};

export default FacebookDepositsTable;
