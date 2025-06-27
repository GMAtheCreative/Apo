import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

export const suiClient = new SuiClient({
  url: process.env.SUI_NETWORK || getFullnodeUrl("testnet"),
});
