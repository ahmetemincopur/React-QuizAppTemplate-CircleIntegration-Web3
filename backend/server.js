const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.post("/api/initialize_user", async (req, res) => {
  const idempotencyKey = req.body.idempotencyKey || require("uuid").v4();
  const userToken = req.body.userToken;

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/initialize",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "X-User-Token": userToken,
    },
    data: { idempotencyKey: idempotencyKey, blockchains: ["MATIC-AMOY"] },
  };

  try {
    const response = await axios.request(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log("idempotency key: ", idempotencyKey);
    console.error(
      "Error initializing user:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

app.get("/api/wallets", async (req, res) => {
  const userToken = req.headers["x-user-token"];

  const options = {
    method: "GET",
    url: "https://api.circle.com/v1/w3s/wallets?pageSize=10",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "X-User-Token": userToken,
    },
  };

  try {
    const response = await axios.request(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching wallets:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

app.post("/api/transfer", async (req, res) => {
  const userToken = req.headers["x-user-token"];
  const transferData = req.body;
  console.log(userToken);
  console.log(transferData);

  const options = {
    method: "POST",
    url: "https://api.circle.com/v1/w3s/user/transactions/transfer",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
      "X-User-Token": userToken,
    },
    data: transferData,
  };

  try {
    const response = await axios.request(options);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error initiating transfer:",
      error.response ? error.response.data : error.message
    );
    res
      .status(error.response ? error.response.status : 500)
      .json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
