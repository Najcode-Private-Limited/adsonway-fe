import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchMyWallet = async () => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.myWallet,
            method: "GET",
        });

        if (apiResponse?.response?.success) {
            return apiResponse?.response?.data;
        }

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};
