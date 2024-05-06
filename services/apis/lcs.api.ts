import api from "../middleware/middleware";

interface IFetchLcsParams {
    search?: string;
    page?: number;
}

export const fetchLcs = async () => {
    try {
        const { data } = await api.get(`/lcs`); 
        return data.data.data;
    } catch (error:any) {
        console.log(error);
        return error.response?.data?.message || "Something went wrong";    
    }
};

