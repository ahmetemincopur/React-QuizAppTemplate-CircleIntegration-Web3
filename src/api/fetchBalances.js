export const fetchBalances = async (walletId) => {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.circle.com/v1/w3s/wallets/${walletId}/balances?pageSize=10`,
      options
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw error;
  }
};
