import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchAgentUsers = async ({ agentId, params }) => {
    if (!agentId) return [];

    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.get_users_by_agent}/${agentId}`,
            method: "GET",
            params,
        });

        if (apiResponse?.response?.success) {
            return apiResponse?.response?.data;
        }

        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
};
