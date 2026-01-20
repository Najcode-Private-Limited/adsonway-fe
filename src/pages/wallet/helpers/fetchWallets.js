import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchWallets = async ({ params, id }) => {
    try {
        const endpoint = id
            ? `${endpoints.getAllUserWallet}/${id}`
            : endpoints.allWallet;

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
        throw error;
    }
};
