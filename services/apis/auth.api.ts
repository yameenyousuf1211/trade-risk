import { ILoginFields, IRegisterFields } from "@/types/type";
import { STATUS } from "@/utils";
import api from "../middleware/middleware";
import Cookies from "js-cookie";

export const onLogin = async (payload: ILoginFields) => {
  try {
    const { data } = await api.post("/auth/login", payload);

    if (data.status === STATUS.UNPROCESSABLE_ENTITY)
      return { success: false, response: data.message };
    if (data.status === STATUS.BAD_REQUEST)
      return { success: false, response: data.message };

    localStorage.setItem("accessToken", data.data.accessToken);
    Cookies.set("accessToken", data.data.accessToken, { expires: 7 });
    return { success: true, response: data };
  } catch (error: any) {
    // console.error(error);
    return {
      success: false,
      response: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const onRegister = async (payload: IRegisterFields | any) => {
  try {
    const response = await api.post("/auth/register", payload);

    if (response.status === STATUS.UNPROCESSABLE_ENTITY)
      return { success: false, response: response.data.message };
    if (response.status === STATUS.BAD_REQUEST)
      return { success: false, response: response.data.message };
    console.log(response);
    return { success: true, response: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get("/auth/current-user");
    return {
      success: true,
      response: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};

export const logoutUser = async () => {
  try {
    const { data } = await api.post("/auth/logout");

    return {
      success: true,
      response: data,
    };
  } catch (error: any) {
    return {
      success: false,
      response: error?.response?.data?.message || "Something went wrong",
    };
  }
};
