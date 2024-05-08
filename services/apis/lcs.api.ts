import { STATUS } from "@/utils";
import api from "../middleware/middleware";

interface IFetchLcsParams {
  search?: string;
  page?: number;
}

export const fetchLcs = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(
      `/lcs?limit=${limit || 10}&page=${page || 1}`
    );

    return data.data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const onCreateLC = async (payload: any) => {
  try {
    const response = await api.post("/lcs/create", payload);
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

export const getBankLcStatus = async (id: any) => {
  try {
    const response = await api.get(`/lcs/status/check/${id}`);
    
    return { success: true, response: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};
