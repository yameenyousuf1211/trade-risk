import api from "../middleware/middleware";

export const addRole = async  (name: string) => {
    try {
        const response = await api.post('/role', {name});
        return { success: true, response: response.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}

export const fetchRoles = async () => {
    try {
        const response = await api.get('/role');
        return { success: true, response: response.data.data.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}

export const deleteRole = async (id: string) => {
    try {
        const response = await api.delete(`/role/${id}`);
        return { success: true, response: response.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}

export const updateRole = async ({id, data}:{id:string,data:any}) => {
    try {
        const response = await api.put(`/role/${id}`, data);
        return { success: true, response: response.data };
    } catch (error) {
        console.error(error);
        return { success: false, response: (error as any).response.data.message };
    }
}

export const fetchSingleRole = async (role: string) => {
    try {
        const response = await api.get(`/role/${role}`);
        return {
            response: response.data.data,
            success:true
        }
    } catch (error) {
        console.log(error);
        return {
            response: (error as any).response.data.message,
            success:false
        }
                
    }
}
