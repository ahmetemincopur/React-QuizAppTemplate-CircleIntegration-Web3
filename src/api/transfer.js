import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateTransfer = async (userToken, walletId, amount) => {
  const destinationAddress = process.env.REACT_APP_USDC_DESTINATION_ADDRESS;
  console.log(destinationAddress);
  const idempotencyKey = uuidv4();
  const tokenId = `${process.env.REACT_APP_USDC_TOKEN_ID}`;
  console.log(tokenId);
  const transferData = {
    idempotencyKey: idempotencyKey,
    amounts: [`${amount}`],
    destinationAddress: `${process.env.REACT_APP_USDC_DESTINATION_ADDRESS}`,
    feeLevel: "HIGH",
    walletId: walletId,
    tokenId: tokenId,
  };

  try {
    const options = {
      method: "POST",
      url: "http://localhost:5000/api/transfer",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-User-Token": userToken,
      },
      data: transferData,
    };

    const response = await axios.request(options);
    const data = response.data;
    console.log("Transfer initiated: ", data);
    return data;
  } catch (error) {
    console.error("Error initiating transfer:", error);
    throw error;
  }
};
