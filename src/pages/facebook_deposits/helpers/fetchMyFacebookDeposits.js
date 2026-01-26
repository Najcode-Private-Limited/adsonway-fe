import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchMyFacebookDeposits = async ({ params }) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.myFacebookAccountTopUpRequests,
            method: "GET",
            params,
        });

        if (apiResponse?.response?.success) {
            return apiResponse?.response?.data;
        }

        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
};
