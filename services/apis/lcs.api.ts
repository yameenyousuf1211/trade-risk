import { STATUS } from "@/utils";
import api from "../middleware/middleware";

export const fetchLcs = async ({
  page,
  limit,
  draft,
  search,
  filter,
  userId,
}: {
  page?: number;
  limit?: number;
  draft?: boolean;
  search?: string;
  filter?: string;
  userId: string;
}) => {
  try {
    if (!userId) return;
    const { data } = await api.get(
      `/lcs?limit=${limit || 7}&page=${page || 1}&draft=${
        draft || false
      }&search=${search || ""}&filter=${
        (filter && encodeURIComponent(filter)) || ""
      }&createdBy=${userId}`
    );

    return data.data.updatedData;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const fetchAllLcs = async ({
  page,
  limit,
  search,
  filter,
}: {
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
}) => {
  try {
    const { data } = await api.get(
      `/lcs?limit=${limit || 7}&page=${page || 1}&draft=${false}&search=${
        search || ""
      }&filter=${(filter && encodeURIComponent(filter)) || ""}`
    );
    return data.data.updatedData;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const fetchSingleLc = async (id: string) => {
  try {
    const { data } = await api.get(`/lcs/${id}`);

    return data.data;
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

export const onUpdateLC = async ({
  id,
  payload,
}: {
  payload: any;
  id: string;
}) => {
  try {
    const response = await api.put(`/lcs/${id}`, payload);
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

export const getBankLcStatus = async (requestId: string, key: string) => {
  try {
    const response = await api.get(`/lcs/status/check/${requestId}?key=${key}`);
    return { success: true, response: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const deleteLcDraft = async (id: string) => {
  try {
    const response = await api.delete(`/lcs/${id}`);

    return { success: true, response: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};
