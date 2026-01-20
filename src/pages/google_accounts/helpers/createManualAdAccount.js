import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const createManualAdAccount = async (payload) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.createManualGoogleAccount,
            method: "POST",
            data: payload,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        return { response: { success: false, message: "Something went wrong" } };
    }
};
