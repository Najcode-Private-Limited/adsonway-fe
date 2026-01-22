import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const updateAdAccount = async ({ id, data }) => {
    try {
        const apiResponse = await apiService({
            endpoint: `${endpoints.updateFacebookAdAccount}/${id}`,
            method: "PATCH",
            data: data,
        });
        return apiResponse;
    } catch (error) {
        console.error(error);
        return { response: { success: false, message: "Something went wrong" } };
    }
};
