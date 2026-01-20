import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const fetchMyAdAccounts = async ({ params }) => {
    try {
        const apiResponse = await apiService({
            endpoint: endpoints.myFacebookAccounts,
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
