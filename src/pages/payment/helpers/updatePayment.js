import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const updatePayment = async ({ id, data }) => {
    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.updatePayment}/${id}`,
            method: "PATCH",
            data,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
