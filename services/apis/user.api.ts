import api from "../middleware/middleware";

export const addBank = async (data: any) => {
    try {
        const response = await api.put('/user/bank', data);
        return { success: true, response: response.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}

export const removeBank = async (data: any) => {
    try {
        
        const response = await api.put(`/user/bank/`,data);
        return { success: true, response: response.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}