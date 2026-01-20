import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { toast } from "sonner";


import { fetchPayments } from "../helpers/fetchPayments";
import { deletePayment } from "../helpers/deletePayment";

const PaymentTable = ({ setPaymentsLength, params, setParams, onEdit }) => {
    const queryClient = useQueryClient();

    const {
        data: paymentsRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["payments", params],
        queryFn: () => fetchPayments({ params }),
    });

    const payments = paymentsRes || [];
    const totalPayments = payments?.length || 0;

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const { mutate: deletePaymentMutation, isPending: isDeleting } = useMutation({
        mutationFn: deletePayment,
        onSuccess: () => {
            toast.success("Payment method deleted successfully");
            queryClient.invalidateQueries(["payments"]);
            handleCloseDialog();
        },
        onError: (error) => {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to delete payment method");
            handleCloseDialog();
        },
    });

    const handleOpenDialog = (payment) => {
        setOpenDelete(true);
        setSelectedPayment(payment);
    };

    const handleCloseDialog = () => {
        setOpenDelete(false);
        setSelectedPayment(null);
    };

    const handleDeletePayment = (id) => {
        deletePaymentMutation(id);
    };

    useEffect(() => {
        if (setPaymentsLength) {
            setPaymentsLength(totalPayments);
        }
    }, [totalPayments, setPaymentsLength]);

    const columns = [
        {
            key: "name",
            label: "Name",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="font-medium text-white">
                        {value}
                    </Typography>
                </div>
            ),
        },
        {
            key: "description",
            label: "Description",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-white">
                        {value || "-"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "is_active",
            label: "Status",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium capitalize ${value ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {value ? "Active" : "Inactive"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created at",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography>
                        {value ? format(new Date(value), "dd/MM/yyyy hh:mm a") : "-"}
                    </Typography>
                    {value !== row.updatedAt && row.updatedAt && (
                        <Typography className="text-gray-500 text-sm">
                            Last updated -{" "}
                            {formatDistanceToNow(new Date(row.updatedAt), {
                                addSuffix: true,
                            })}
                        </Typography>
                    )}
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
                            label: "Edit Payment Method",
                            icon: Pencil,
                            action: () => onEdit?.(row._id),
                        },
                        {
                            label: "Delete Payment Method",
                            icon: Trash2,
                            action: () => handleOpenDialog(row),
                            className: "text-red-500",
                        },
                    ]}
                />
            ),
        },
    ];

    const onPageChange = (page) => {
        setParams((prev) => ({
            ...prev,
            page: page + 1,
        }));
    };

    const perPage = params?.per_page || 25;
    const currentPage = params?.page || 1;
    const totalPages = Math.ceil(totalPayments / perPage);

    return (
        <>
            <CustomTable
                columns={columns}
                data={payments}
                isLoading={isLoading}
                error={error}
                emptyStateMessage="No payments found"
                perPage={perPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <CustomDialog
                onOpen={openDelete}
                onClose={handleCloseDialog}
                title={selectedPayment?.name}
                modalType="Delete"
                onDelete={handleDeletePayment}
                id={selectedPayment?._id}
                isLoading={isDeleting}
            />
        </>
    );
};

export default PaymentTable;
