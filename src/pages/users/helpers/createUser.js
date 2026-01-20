import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";


export const createUser = async (formData) => {
    try {
        const response = await apiService({
            endpoint: endpoints.user_register,
            method: "POST",
            data: formData,
            hasFile: true,
        });

        return response;
    } catch (error) {
        console.error(error);
    }
};
