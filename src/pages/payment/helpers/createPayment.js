import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const createPayment = async (data) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.createPayment,
            method: "POST",
            data,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
