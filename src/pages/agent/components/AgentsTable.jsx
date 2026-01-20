import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, formatDistanceToNow } from "date-fns";
import ActionMenu from "@/components/action_menu";
import { Pencil, Trash2 } from "lucide-react";
import CustomTable from "@/components/custom_table";
import Typography from "@/components/typography";
import { useEffect, useState } from "react";
import { CustomDialog } from "@/components/custom_dialog";
import { toast } from "sonner";

import { useNavigate } from "react-router";
import { fetchAgents } from "../helpers/fetchAgents";

const AgentsTable = ({ setAgentsLength, params, setParams }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: agentsRes,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["agents", params],
        queryFn: () => fetchAgents({ params }),
    });

    const agents = agentsRes || [];
    const totalAgents = agents?.length || 0;

    const [openDelete, setOpenDelete] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const handleOpenDialog = (agent) => {
        setOpenDelete(true);
        setSelectedAgent(agent);
    };

    const handleCloseDialog = () => {
        setOpenDelete(false);
        setSelectedAgent(null);
    };

    const handleDeleteAgent = (id) => {
        // deleteAgentMutation(id);
        console.log("Delete agent:", id);
    };

    const onNavigateToEdit = (id) => {
        navigate(`/dashboard/agents/edit/${id}`);
    };

    useEffect(() => {
        if (setAgentsLength) {
            setAgentsLength(totalAgents);
        }
    }, [totalAgents, setAgentsLength]);

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
                            label: "Edit Agent",
                            icon: Pencil,
                            action: () => onNavigateToEdit(row._id),
                        },
                        {
                            label: "Delete Agent",
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
    const totalPages = Math.ceil(totalAgents / perPage);

    return (
        <>
            <CustomTable
                columns={columns}
                data={agents}
                isLoading={isLoading}
                error={error}
                emptyStateMessage="No agents found"
                perPage={perPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />

            <CustomDialog
                onOpen={openDelete}
                onClose={handleCloseDialog}
                title={`Delete ${selectedAgent?.full_name}`}
                description="This action will permanently remove the agent account."
                modalType="Delete"
                onConfirm={() => handleDeleteAgent(selectedAgent?._id)}
            />
        </>
    );
};

export default AgentsTable;
