import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const updateAdApplicationStatus = async ({ id, status, adminNote }) => {
    try {
        const payload = {
            status,
            adminNote,
        };

        const response = await apiService({
            endpoint: `${endpoints.updateFacebookAdStatus}/${id}`,
            method: "PATCH",
            data: payload,
        });

        return response;
    } catch (error) {
        console.error("Error updating ad application status:", error);
        throw error;
    }
};
