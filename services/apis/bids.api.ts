import { STATUS } from "@/utils";
import api from "../middleware/middleware";

export const fetchSingleBid = async (id: string) => {
  try {
    const { data } = await api.get(`/bids/${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const acceptOrRejectBid = async ({
  status,
  id,
  key,
}: {
  status: string;
  id: string;
  key: string;
}) => {
  try {
    const { data } = await api.put(`/bids?status=${status}&key=${key}`, {
      id,
    });
    console.log(data, "status update");
    if (data.status === STATUS.NOT_FOUND)
      return { success: false, response: data.message };
    if (data.status === STATUS.BAD_REQUEST)
      return { success: false, response: data.message };

    return {
      success: true,
      response: data.message,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      response: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const addBid = async ({
  confirmationPrice,
  lc,
  type,
  validity,
  discountBaseRate,
  discountMargin,
  risk,
  perAnnum,
}: {
  type: string;
  lc?: string;
  risk?: string;
  validity: string;
  confirmationPrice: string;
  discountBaseRate?: string;
  discountMargin?: string;
  perAnnum?: boolean;
}) => {
  try {
    const baseData = {
      confirmationPrice,
      lc,
      risk,
      bidType: type,
      bidValidity: validity,
    };

    const reqData = discountMargin
      ? {
          ...baseData,
          discountMargin,
          discountBaseRate,
          perAnnum,
        }
      : baseData;
    console.log(reqData, "addbidreq");
    const { data } = await api.post(`/bids`, reqData);

    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      response: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const fetchMyBids = async ({
  page,
  limit,
  filter,
  search,
}: {
  page: number;
  limit: number;
  filter?: string;
  search?: string;
}) => {
  try {
    const { data } = await api.get(
      `/bids?bidBy=true&limit=${limit || 7}&page=${page || 1}&filter=${
        (filter && encodeURIComponent(filter)) || ""
      }&search=${search || ""}`
    );
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const fetchCorporateBids = async ({
  page,
  limit,
  filter,
  search,
  userId,
}: {
  page: number;
  limit: number;
  filter?: string;
  search?: string;
  userId: string;
}) => {
  try {
    const { data } = await api.get(
      `/bids?limit=${limit || 7}&page=${page || 1}&filter=${
        (filter && encodeURIComponent(filter)) || ""
      }&search=${search || ""}&lcOwner=${userId}`
    );
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const getBidsCount = async () => {
  try {
    const { data } = await api.get(`/bids/count/list`);
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const getTotalRequests = async () => {
  try {
    const { data } = await api.get(`/lcs/total-request/list`);
    return data.data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};
