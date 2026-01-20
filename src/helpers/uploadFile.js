import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";

export const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiService({
            endpoint: endpoints.upload_file,
            method: "POST",
            data: formData,
            hasFile: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    } catch (error) {
        console.error("File upload error:", error);
        return { success: false, message: error.message };
    }
};
