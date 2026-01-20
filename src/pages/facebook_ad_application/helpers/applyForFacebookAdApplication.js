import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const applyForFacebookAdApplication = async (payload) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.applyFacebookAd,
            method: "POST",
            data: payload,
        });

        return apiResponse;
    } catch (error) {
        console.error(error);
        return { response: { success: false, message: error.message } };
    }
};
