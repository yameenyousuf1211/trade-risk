import { STATUS } from "@/utils";
import api from "../middleware/middleware";

export const fetchBids = async ({ id }: { id: string }) => {
  try {
    const { data } = await api.get(`/bids?lc=${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const fetchSingleBid = async (id: string) => {
  try {
    const { data } = await api.get(`/bids/${id}`);
    return data.data;
  } catch (error: any) {
    console.log(error);
    return error.response?.data?.message || "Something went wrong";
  }
};

export const acceptOrRejectBid = async (status: string, id: string) => {
  try {
    const { data } = await api.put(`/bids?status=${status}`, {
      id,
    });
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
  discountingPrice,
}: {
  type: string;
  lc: string;
  validity: string;
  confirmationPrice: string;
  discountingPrice?: string;
}) => {
  try {
    const { data } = await api.post(`/bids`, {
      bidType: type,
      bidValidity: validity,
      confirmationPrice: confirmationPrice,
      lc: lc,
      ...(discountingPrice && { discountingPrice }),
    });

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
      `/bids?bidBy=true&limit=${limit || 10}&page=${page || 1}`
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
