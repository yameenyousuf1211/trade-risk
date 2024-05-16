import api from "../middleware/middleware";

export const getCountries = async () => {
  try {
    const response = await api.get("/country");

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getBanks = async (country: string) => {
  try {
    const response = await api.get(`/country/banks/${country.toLowerCase()}`);

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getCities = async (country: string) => {
  try {
    if (!country) return;
    const response = await api.get(`/country/list/cities?country=${country}`);

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getCurrenncy = async () => {
  try {
    const response = await api.get(`/country/currencies/list`);

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getPorts = async (country: string) => {
  try {
    const capitalizedCountry =
      country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
    const response = await api.get(
      `/ports/details?country=${capitalizedCountry}`
    );

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};
