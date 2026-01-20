import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { toast } from "sonner";
import { fetchWallets } from "../helpers/fetchWallets";
import { deleteWallet } from "../helpers/deleteWallet";
import { getItem } from "@/utils/local_storage";

const WalletTable = ({ setWalletsLength, params, setParams, onEdit }) => {
    const queryClient = useQueryClient();
    const userRole = getItem("userRole");
    const userId = getItem("userId");

    const {
        data: walletsRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["wallets", params, userRole, userId],
        queryFn: () => fetchWallets({ params, id: userRole === "user" ? userId : null }),
    });

    const wallets = walletsRes || [];
    const totalWallets = wallets?.length || 0;

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const { mutate: deleteWalletMutation, isPending: isDeleting } = useMutation({
        mutationFn: deleteWallet,
        onSuccess: () => {
            toast.success("Wallet deleted successfully");
            queryClient.invalidateQueries(["wallets"]);
            handleCloseDialog();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete wallet");
            handleCloseDialog();
        },
    });

    const handleOpenDialog = (wallet) => {
        setOpenDelete(true);
        setSelectedWallet(wallet);
    };

    const handleCloseDialog = () => {
        setOpenDelete(false);
        setSelectedWallet(null);
    };

    const handleDeleteWallet = (id) => {
        deleteWalletMutation(id);
    };

    useEffect(() => {
        if (setWalletsLength) {
            setWalletsLength(totalWallets);
        }
    }, [totalWallets, setWalletsLength]);

    const allColumns = [
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
            key: "amount",
            label: "Requested Amount",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-white font-semibold">
                        {row.walletId?.currency || "$"} {value?.toLocaleString() || "0"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "walletId",
            label: "Wallet Balance",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-gray-400">
                        {value?.currency || "$"} {value?.amount?.toLocaleString() || "0"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "transcationId",
            label: "Transaction ID",
            render: (value) => (
                <Typography className="text-white font-mono text-sm">
                    {value || "N/A"}
                </Typography>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${value === "approved" ? "bg-teal-500/20 text-teal-400" :
                    value === "pending" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                    } capitalize`}>
                    {value || "pending"}
                </span>
            ),
        },
        {
            key: "screenshotUrl",
            label: "Screenshot",
            render: (value) => (
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                    >
                        View Receipt
                    </a>
                ) : (
                    <Typography className="text-gray-500 text-sm">No image</Typography>
                )
            ),
        },
        {
            key: "remarks",
            label: "Remarks",
            render: (value) => (
                <Typography className="text-gray-400 text-sm max-w-[200px] truncate">
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
        {
            key: "actions",
            label: "Actions",
            render: (value, row) => (
                <ActionMenu
                    options={[
                        {
                            label: "View Details",
                            icon: Pencil,
                            action: () => onEdit?.(row._id),
                        },
                        {
                            label: "Delete Request",
                            icon: Trash2,
                            action: () => handleOpenDialog(row),
                            className: "text-red-500",
                        },
                    ]}
                />
            ),
        },
    ];

    const columns = userRole === "user"
        ? allColumns.filter(col => col.key !== "userId")
        : allColumns;

    const onPageChange = (page) => {
        setParams((prev) => ({
            ...prev,
            page: page + 1,
        }));
    };

    const perPage = params?.per_page || 25;
    const currentPage = params?.page || 1;
    const totalPages = Math.ceil(totalWallets / perPage);

    return (
        <>
            <CustomTable
                columns={columns}
                data={wallets}
                isLoading={isLoading}
                error={error}
                emptyStateMessage="No wallets found"
                perPage={perPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <CustomDialog
                onOpen={openDelete}
                onClose={handleCloseDialog}
                title={selectedWallet?.userId?.full_name}
                modalType="Delete"
                onDelete={handleDeleteWallet}
                id={selectedWallet?._id}
                isLoading={isDeleting}
            />
        </>
    );
};

export default WalletTable;
