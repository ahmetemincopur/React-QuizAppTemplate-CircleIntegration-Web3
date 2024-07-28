import axios from "axios";

export const fetchWallet = async (userToken) => {
  try {
    const response = await axios.get("http://localhost:5000/api/wallets", {
      headers: {
        "X-User-Token": userToken,
      },
    });
    const data = await response;
    console.log("fetch Wallets : " + data);
    return data;
  } catch (error) {
    console.error("Error fetching wallet data:", error);
    throw error;
  }
};
