import api from "../middleware/middleware";

export const createLg = async (data: any) => {
    try {
        data.data.draft = data.draft;
        data.data.type = data.type;
        const response = await api.post("/lcs/create/lg", data.data);
        return { success: true, response: response.data };
    } catch (error: any) {
        console.log(error);
        return { success: false, response: error.response?.data?.message || "Something went wrong" };
    }
}
