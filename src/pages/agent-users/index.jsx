import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import CustomActionMenu from "@/components/custom_action";
import NavbarItem from "@/components/navbar/navbar_item";
import AgentUsersTable from "./components/AgentUsersTable";
import { SelectDropdown } from "@/components/ui/select-dropdown";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/pages/agent/helpers/fetchAgents";

const AgentUsers = () => {
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [usersLength, setUsersLength] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [params, setParams] = useState({
        page: 1,
        per_page: 25,
        search: "",
        start_date: undefined,
        end_date: undefined,
    });
    const { data: agentsData } = useQuery({
        queryKey: ["agents-list"],
        queryFn: () => fetchAgents({ params: { per_page: 100 } }),
    });

    const agents = Array.isArray(agentsData) ? agentsData : [];

    const debouncedSearch = useDebounce(searchText, 500);

    const handleSearch = (e) => {
        setSearchText(e.target.value);
    };

    const onRowsPerPageChange = (newRowsPerPage) => {
        setParams((prev) => ({
            ...prev,
            per_page: newRowsPerPage,
        }));
    };

    const breadcrumbs = [{ title: "Agent Users", isNavigation: true }];

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
        }));
    }, [debouncedSearch]);

    return (
        <div className="flex flex-col">
            <NavbarItem
                title="Agent Users"
                breadcrumbs={breadcrumbs}
            />

            <div className="px-4 space-y-4">
                {/* Agent Selection Combobox */}
                <div className="w-full flex items-center gap-4">
                    {/* <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap">
                        Please select agent
                    </label> */}
                    <div className="w-[300px]">
                        <SelectDropdown
                            options={agents.map(a => ({ label: a.full_name, value: a._id }))}
                            value={selectedAgentId}
                            onValueChange={setSelectedAgentId}
                            placeholder="Please select agent"
                        />
                    </div>
                </div>

                <div className="border rounded-lg bg-card text-card-foreground shadow-sm">
                    <CustomActionMenu
                        title={selectedAgentId ? "Agent's Users" : "Users"}
                        total={usersLength}
                        onAdd={null}
                        disableAdd={true}
                        searchText={searchText}
                        handleSearch={handleSearch}
                        onRowsPerPageChange={onRowsPerPageChange}
                        showRowSelection={false}
                        rowsPerPage={params.per_page}
                        disableBulkExport={true}
                    />
                    <AgentUsersTable
                        agentId={selectedAgentId}
                        setUsersLength={setUsersLength}
                        params={params}
                        setParams={setParams}
                    />
                </div>
            </div>
        </div>
    );
};

export default AgentUsers;
