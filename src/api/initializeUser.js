import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initializeUser = async (userId) => {
  const idempotencyKey = uuidv4();
  const userToken = localStorage.getItem("REACT_APP_USER_TOKEN"); // Get user token from localStorage

  localStorage.setItem("IDEMPOTENCY_KEY", idempotencyKey);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/initialize_user",
      {
        idempotencyKey,
        userId,
        userToken, // Include userToken in the request body
      }
    );
    return response.data.data.challengeId;
  } catch (error) {
    console.error("Error in initializeUser:", error.message);
    console.log(userId);
    console.log(idempotencyKey);
    console.log(userToken);
    return null;
  }
};
