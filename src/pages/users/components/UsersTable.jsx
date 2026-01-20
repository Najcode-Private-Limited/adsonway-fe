import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Eye, Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { toast } from "sonner";

import { useNavigate } from "react-router";
import { fetchUsers } from "../helpers/fetchUsers";

const UsersTable = ({ setUsersLength, params }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: usersRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["users", params],
        queryFn: () => fetchUsers({ params }),
    });

    const users = usersRes || [];
    const totalUsers = users?.length || 0;

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenDialog = (user) => {
        setOpenDelete(true);
        setSelectedUser(user);
    };

    const handleCloseDialog = () => {
        setOpenDelete(false);
        setSelectedUser(null);
    };

    // const { mutate: deleteUserMutation, isLoading: isDeleting } = useMutation({
    //   mutationFn: deleteUser,
    //   onSuccess: () => {
    //     toast.success("User deleted successfully.");
    //     queryClient.invalidateQueries(["users"]);
    //     handleCloseDialog();
    //   },
    //   onError: (error) => {
    //     console.error(error);
    //     toast.error("Failed to delete user.");
    //   },
    // });

    const handleDeleteUser = (id) => {
        // deleteUserMutation(id);
        console.log("Delete user", id);
    };

    const onNavigateToEdit = (id) => {
        navigate(`/dashboard/users/edit/${id}`);
    };

    useEffect(() => {
        if (setUsersLength) {
            setUsersLength(totalUsers);
        }
    }, [totalUsers, setUsersLength]);

    const columns = [
        {
            key: "full_name",
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
            key: "email",
            label: "Email",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-white">
                        {row.email}
                    </Typography>
                </div>
            ),
        },
        {
            key: "role",
            label: "Role",
            render: (value) => (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-teal-500/20 text-teal-400 capitalize">
                    {value}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Created at",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography>
                        {format(new Date(value), "dd/MM/yyyy hh:mm a")}
                    </Typography>
                    {value !== row.updatedAt && (
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
                            label: "Edit User",
                            icon: Pencil,
                            action: () => onNavigateToEdit(row._id),
                        },
                        {
                            label: "Delete User",
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
        // Implement pagination if supported by API and params
    };

    const perPage = params.per_page;
    const currentPage = params.page;
    const totalPages = Math.ceil(totalUsers / perPage);

    return (
        <>
            <CustomTable
                columns={columns}
                data={users}
                isLoading={isLoading}
                error={error}
                emptyStateMessage="No users found"
                perPage={perPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <CustomDialog
                onOpen={openDelete}
                onClose={handleCloseDialog}
                title={`Delete ${selectedUser?.name}`}
                description="This action will permanently remove the user account."
                modalType="Delete"
                onConfirm={() => handleDeleteUser(selectedUser?._id)}
            // isLoading={isDeleting}
            />
        </>
    );
};

export default UsersTable;
