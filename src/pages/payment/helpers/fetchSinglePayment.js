import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchSinglePayment = async (id) => {
    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.getSinglePayment}/${id}`,
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
