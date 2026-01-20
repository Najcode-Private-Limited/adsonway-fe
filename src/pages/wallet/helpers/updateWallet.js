import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const updateWallet = async ({ id, data }) => {
    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.updateWallet}/${id}`,
            method: "PATCH",
            data,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
