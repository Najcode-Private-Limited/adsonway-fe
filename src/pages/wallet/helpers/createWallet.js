import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const createWallet = async (data) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.createWallet,
            method: "POST",
            data,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
