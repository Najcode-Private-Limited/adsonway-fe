import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";
import { getItem } from "@/utils/local_storage";

export const fetchProfile = async () => {
    try {
        const response = await apiService({
            endpoint: endpoints.admin,
            method: "GET",
        });
        return response;
    } catch (error) {
        console.error("Fetch profile error:", error);
        return { success: false, message: error.message };
    }
};

export const updateProfile = async (data) => {
    try {
        const role = getItem("userRole");
        let endpoint = endpoints.update_profile;
        if (role === "agent") endpoint = endpoints.update_agent_profile;
        if (role === "user") endpoint = endpoints.update_user_profile;
        const response = await apiService({
            endpoint,
            method: "PATCH",
            data,
        });
        return response;
    } catch (error) {
        console.error("Update profile error:", error);
        return { success: false, message: error.message };
    }
};
