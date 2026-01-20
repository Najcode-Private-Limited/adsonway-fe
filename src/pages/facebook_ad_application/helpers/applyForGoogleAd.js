import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const applyForGoogleAd = async (payload) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.applyGoogleAd,
            method: "POST",
            data: payload,
        });

        return apiResponse;
    } catch (error) {
        console.error(error);
        return { response: { success: false, message: error.message } };
    }
};
