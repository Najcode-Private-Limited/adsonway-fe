import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { format } from "date-fns";
import { fetchAdApplications } from "../helpers/fetchAdApplications";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ViewAdApplicationDialog from "./ViewAdApplicationDialog";

const AdApplicationTable = ({ setTotalRecords, params, onPageChange }) => {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const {
        data: dataRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["facebookAdApplications", params],
        queryFn: () => fetchAdApplications({ params }),
    });
    const records = dataRes?.applications || dataRes?.data || [];
    const totalRecords = records?.length || 0;
    const apiTotalPages = dataRes?.totalPages || 1;

    useEffect(() => {
        if (setTotalRecords) {
            setTotalRecords(records.length);
        }
    }, [records.length, setTotalRecords]);

    const handleView = (record) => {
        setSelectedApplication(record);
        setViewDialogOpen(true);
    };

    const columns = [
        {
            key: "user",
            label: "User",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="font-medium text-white">
                        {value?.full_name || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-sm">
                        {value?.email || "N/A"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "licenseNumber",
            label: "License",
            render: (value, row) => (
                <div className="flex flex-col">
                    <Typography className="text-gray-300 text-sm font-medium capitalize">
                        {row.licenseType || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-xs">
                        {value || "N/A"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "domainUrls",
            label: "Domains",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    {Array.isArray(value) && value.length > 0 ? (
                        value.map((url, i) => (
                            <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline text-sm truncate max-w-[200px]"
                            >
                                {url}
                            </a>
                        ))
                    ) : (
                        <Typography className="text-gray-500 text-sm">N/A</Typography>
                    )}
                </div>
            ),
        },
        {
            key: "submissionFee",
            label: "Fee",
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
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize ${value === "approved" ? "bg-green-500/20 text-green-400" :
                    value === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                    }`}>
                    {value || "N/A"}
                </span>
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
                emptyStateMessage="No Facebook ad accounts found"
                perPage={params.limit}
                currentPage={params.page}
                totalPages={apiTotalPages}
                onPageChange={onPageChange}
            />

            <ViewAdApplicationDialog
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
                data={selectedApplication}
            />
        </>
    );
};

export default AdApplicationTable;
