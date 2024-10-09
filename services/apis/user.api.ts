import api from "../middleware/middleware";

export const addRemoveBank = async (data: any) => {
  try {
    const response = await api.put(`/business/update-bank`, data);
    return { success: true, response: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const updateUser = async (data: any) => {
  try {
    const response = await api.put("/user", data);

    return {
      success: true,
      response: response.data,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      response: (error as any).response.data.message,
    };
  }
};
