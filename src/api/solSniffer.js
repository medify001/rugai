import axios from "axios";

const API_URL = "https://solsniffer.com/api/v2/";
const API_KEY = "l15c0fdektmp9hxp2ayx45sbwe3g7k";

export const fetchTokenData = async (address) => {
  try {
    const response = await axios.get(`${API_URL}token/${address}`, {
      headers: { "X-API-KEY": API_KEY },
      
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching token data:", error);
    return null;
  }
};

export const refreshTokenData = async (address) => {
  try {
    const response = await axios.get(`${API_URL}token/refresh/${address}`, {
      headers: { "X-API-KEY": API_KEY },
    });
    return response.data;
  } catch (error) {
    console.error("Error refreshing token data:", error);
    return null;
  }
};
