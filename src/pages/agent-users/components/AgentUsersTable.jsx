import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect } from "react";
import { fetchAgentUsers } from "../helpers/fetchAgentUsers";

const AgentUsersTable = ({ agentId, setUsersLength, params, setParams }) => {
    const {
        data: usersRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["agent-users", agentId, params],
        queryFn: () => fetchAgentUsers({ agentId, params }),
        enabled: !!agentId,
    });

    const users = Array.isArray(usersRes) ? usersRes : [];
    const totalUsers = users?.length || 0;

    useEffect(() => {
        if (setUsersLength) {
            setUsersLength(totalUsers);
        }
    }, [totalUsers, setUsersLength]);

    const columns = [
        {
            key: "full_name",
            label: "User",
            render: (value, row) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="font-medium text-white">
                        {value}
                    </Typography>
                    <Typography className="text-gray-500 text-sm">
                        @{row.username || "N/A"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "email",
            label: "Email",
            render: (value) => (
                <Typography className="text-white">
                    {value}
                </Typography>
            ),
        },
        {
            key: "wallet",
            label: "Wallet Balance",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-white font-semibold">
                        {value?.currency || "INR"} {value?.amount?.toLocaleString() || "0"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "createdBy",
            label: "Agent",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    <Typography variant="p" className="text-white">
                        {value?.full_name || "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-sm">
                        @{value?.username || "N/A"}
                    </Typography>
                </div>
            ),
        },
        {
            key: "disabled",
            label: "Status",
            render: (value) => (
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${!value ? "bg-teal-500/20 text-teal-400" : "bg-red-500/20 text-red-400"} capitalize`}>
                    {!value ? "Active" : "Disabled"}
                </span>
            ),
        },
        {
            key: "createdAt",
            label: "Date Joined",
            render: (value) => (
                <div className="flex flex-col gap-1">
                    <Typography className="text-sm">
                        {value ? format(new Date(value), "dd/MM/yyyy") : "N/A"}
                    </Typography>
                    <Typography className="text-gray-500 text-xs">
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
                            label: "Edit User",
                            icon: Pencil,
                            action: () => console.log("Edit user:", row._id),
                        },
                        {
                            label: "Manage Wallet",
                            icon: Trash2,
                            action: () => console.log("Manage wallet:", row._id),
                        },
                    ]}
                />
            ),
        },
    ];

    const onPageChange = (page) => {
        setParams?.((prev) => ({
            ...prev,
            page: page + 1,
        }));
    };

    const perPage = params?.per_page || 25;
    const currentPage = params?.page || 1;
    const totalPages = Math.ceil(totalUsers / perPage);

    if (!agentId) {
        return (
            <div className="flex items-center justify-center p-8 text-gray-500 border rounded-md h-[400px]">
                Please select an agent to view their users
            </div>
        );
    }

    return (
        <CustomTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            error={error}
            emptyStateMessage="No users found for this agent"
            perPage={perPage}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
};

export default AgentUsersTable;
