import React, { useState } from "react";
import { createUser } from "../api/createUser";
import { acquireSessionToken } from "../api/acquireSessionToken";
import { initializeUser } from "../api/initializeUser";
import { fetchBalances } from "../api/fetchBalances";
import { fetchWallet } from "../api/fetchWallet";
import { createWallet } from "../api/createWallet";
import { initiateTransfer } from "../api/transfer";

const WalletButton = ({ points }) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    setIsCreating(true);
    try {
      // Step 1: Check if REACT_APP_USER_ID exists in localStorage
      let userId = localStorage.getItem("REACT_APP_USER_ID");

      if (!userId) {
        const userResult = await createUser();
        if (!userResult) {
          throw new Error("Failed to create user");
        }
        userId = userResult.userId;
        localStorage.setItem("REACT_APP_USER_ID", userId);
        console.log("User created successfully. User ID:", userId);
      } else {
        console.log("Using existing User ID from localStorage:", userId);
      }

      // Step 2: Check if session token and encryption key exist in localStorage
      let userToken = localStorage.getItem("REACT_APP_USER_TOKEN");
      let encryptionKey = localStorage.getItem("REACT_APP_ENCRYPTION_KEY");

      const sessionResult = await acquireSessionToken(userId);
      if (!sessionResult) {
        throw new Error("Failed to acquire session token");
      }
      userToken = sessionResult.userToken;
      encryptionKey = sessionResult.encryptionKey;
      localStorage.setItem("REACT_APP_USER_TOKEN", userToken);
      localStorage.setItem("REACT_APP_ENCRYPTION_KEY", encryptionKey);
      console.log("Session token acquired successfully");

      // Step 3: Initialize User
      let challengeId = localStorage.getItem("REACT_APP_CHALLENGE_ID");

      if (!challengeId) {
        const initResult = await initializeUser(userId);
        if (!initResult) {
          throw new Error("Failed to initialize user");
        }
        challengeId = initResult;
        localStorage.setItem("REACT_APP_CHALLENGE_ID", challengeId);
        console.log(
          "User initialized successfully. Challenge ID:",
          challengeId
        );
      } else {
        console.log("Using existing Challenge ID from localStorage");
      }

      // Step 4: Create Wallet
      const appId = process.env.REACT_APP_APP_ID;
      createWallet(appId, userToken, encryptionKey, challengeId);

      // Fetch Wallet ID
      const walletData = await fetchWallet(userToken);
      console.log("Wallet Data:", walletData.data.data.wallets[0].id);
      const walletId = walletData.data.data.wallets[0].id;
      const walletAddress = walletData.data.data.wallets[0].address;
      console.log("Wallet Address:", walletAddress);
      localStorage.setItem("WALLET_ID", walletId);

      // Fetch Balances
      const balancesEarly = await fetchBalances(walletId);
      console.log("Balances:", balancesEarly.data.tokenBalances);
      console.log("Balances:", balancesEarly.data.tokenBalances[1]?.amount);

      if (points > 0) {
        const transferResult = await initiateTransfer(
          userToken,
          walletId,
          points
        );
        console.log("Transfer Result:", transferResult.data.challengeId);
        localStorage.setItem(
          "TRANSFER_CHALLENGE_ID",
          transferResult.data.challengeId
        );

        const sessionResultTransactions = await acquireSessionToken(userId);
        if (!sessionResultTransactions) {
          throw new Error("Failed to acquire session token");
        }
        const userTokenTransactions = sessionResultTransactions.userToken;
        const encryptionKeyTransactions =
          sessionResultTransactions.encryptionKey;

        createWallet(
          appId,
          userTokenTransactions,
          encryptionKeyTransactions,
          transferResult.data.challengeId
        );

        // Fetch Balances
        const balancesLate = await fetchBalances(walletId);
        console.log("Balances:", balancesLate.data.tokenBalances);
        console.log("Balances:", balancesLate.data.tokenBalances[1]?.amount);
      } else {
        console.log("You have to pass 0 for transaction");
      }
    } catch (error) {
      console.error("Error in wallet creation process:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={handleCreateWallet}
        disabled={isCreating}
        style={styles.button}
      >
        {isCreating ? "Processing..." : "Create Wallet / Get Your Earnings"}
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "5vh",
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "15px 32px",
    textAlign: "center",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s ease",
  },
};

export default WalletButton;
