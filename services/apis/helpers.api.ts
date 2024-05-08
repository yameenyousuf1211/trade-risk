import api from "../middleware/middleware";

export const getCountries = async () => {
  try {
    const response = await api.get("/user/countries/list");

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getBanks = async (country: string) => {
  try {
    const capitalizedCountry =
      country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
    const response = await api.get(`/user/${capitalizedCountry}`);

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};
