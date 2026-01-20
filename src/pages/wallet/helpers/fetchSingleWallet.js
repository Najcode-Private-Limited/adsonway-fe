import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchSingleWallet = async (id) => {
    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.getSingleWallet}/${id}`,
            method: "GET",
        });

        if (apiResponse?.response?.success) {
            return apiResponse?.response?.data;
        }

        return null;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
