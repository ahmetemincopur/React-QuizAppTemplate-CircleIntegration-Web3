import { W3SSdk } from "@circle-fin/w3s-pw-web-sdk";

export const createWallet = (appId, userToken, encryptionKey, challengeId) => {
  const sdk = new W3SSdk();
  console.log("created the sdk");

  sdk.setAppSettings({ appId });
  console.log("set the app settings");
  sdk.setAuthentication({ userToken, encryptionKey });
  console.log("set the authentication");

  sdk.execute(challengeId, (error, result) => {
    console.log("INSIDE THE EXECUTE METHOD");
    if (error) {
      console.log(
        `${error?.code?.toString() || "Unknown code"}: ${
          error?.message ?? "Error!"
        }`
      );
      return;
    }

    console.log(`Challenge: ${result.type}`);
    console.log(`status: ${result.status}`);

    if (result.data) {
      console.log(`signature: ${result.data?.signature}`);
    }
  });
};
