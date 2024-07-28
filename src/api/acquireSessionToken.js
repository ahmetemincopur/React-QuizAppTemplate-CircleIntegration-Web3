import axios from "axios";

export const acquireSessionToken = async () => {
  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/users/token",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
    },
    data: { userId: localStorage.getItem("REACT_APP_USER_ID") },
  };

  try {
    const response = await axios.request(options);
    console.log("User token:", response.data.data.userToken);
    console.log("Encryption key:", response.data.data.encryptionKey);
    return {
      userToken: response.data.data.userToken,
      encryptionKey: response.data.data.encryptionKey,
    };
  } catch (error) {
    console.error("Error acquiring session token:", error);
    return null;
  }
};
