import { apiService } from "@/api/api_service/apiService";
import { endpoints } from "@/api/endpoints";


export const createAdmin = async (formData, params) => {
  try {
    const response = await apiService({
      endpoint: endpoints.admin_register,
      method: "POST",
      data: formData,
      hasFile: true,  

    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
