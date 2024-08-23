import api from "../middleware/middleware";

export const createLg = async (data: any) => {
    try {
        const response = await api.post("/lcs/create",data);
        return { success: true, response: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, response: error.response?.data?.message || "Something went wrong" };
    }
}

export const updateLg = async (data: any,id:string) => {
    try {
        const response = await api.put(`/lcs/lg/${id}`, data);
        return { success: true, response: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, response: error.response?.data?.message || "Something went wrong" };
    }
}