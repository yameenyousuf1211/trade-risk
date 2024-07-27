import api from "../middleware/middleware";

export const createLg = async (data: any) => {
    try {
        const response = await api.post("/lcs/create/lg", data);
        return { success: true, response: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, response: error.response?.data?.message || "Something went wrong" };
    }
}
