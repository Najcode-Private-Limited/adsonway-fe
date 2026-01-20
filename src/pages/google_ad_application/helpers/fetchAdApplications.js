import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";
import { getItem } from "@/utils/local_storage";

export const fetchAdApplications = async ({ params }) => {
    try {
        const userRole = getItem("userRole");
        let endpoint = endpoints.adAccounts;

        if (userRole === "user") {
            endpoint = endpoints.myAdApplications;
        }

        const apiResponse = await apiService({
            endpoint,
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
