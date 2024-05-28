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
    const capitalizedCountry = capitalizeWords(country);
    const response = await api.get(`/country/banks/${capitalizedCountry}`);

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

    if (Array.isArray(response.data.data)) {
      const uniqueCurrencies = new Set();

      const filteredResponse = response.data.data.filter((currency: string) => {
        if (uniqueCurrencies.has(currency)) {
          return false;
        } else {
          uniqueCurrencies.add(currency);
          return true;
        }
      });

      return { success: true, response: filteredResponse };
    } else return { success: false, response: "Failed to get currencies" };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getAllPortData = async () => {
  try {
    const { data } = await api.get(`/country/ports/details`);

    return { success: true, response: data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export const getPorts = async (country: string) => {
  try {
    const capitalizedCountry = capitalizeWords(country);
    const response = await api.get(
      `/country/ports/details?country=${capitalizedCountry}`
    );

    return { success: true, response: response.data.data };
  } catch (error) {
    console.error(error);
    return { success: false, response: (error as any).response.data.message };
  }
};

export function capitalizeWords(str: string) {
  const words = str.split(" ");

  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });

  return capitalizedWords.join(" ");
}
