import { STATUS } from "@/utils";
import api from "../middleware/middleware";

export const onCreateRisk = async (payload: any) => {
    try {
      const response = await api.post("/risk", payload);
      if (response.status === STATUS.UNPROCESSABLE_ENTITY)
        return { success: false, response: response.data.message };
      if (response.status === STATUS.BAD_REQUEST)
        return { success: false, response: response.data.message };
  
      return { success: true, response: response.data };
    } catch (error) {
      console.error(error);
      return { success: false, response: (error as any).response.data.message };
    }
  };