import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";
import { getItem } from "@/utils/local_storage";

export const fetchTransactions = async ({ params }) => {
    try {
        const userRole = getItem("userRole");
        let endpoint = endpoints.allTransactions;

        if (userRole === "user") {
            endpoint = endpoints.myTransactions;
        } else if (userRole === "agent") {
            endpoint = endpoints.agentTransactions;
        }

        const apiResponse = await apiService({
            endpoint,
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
