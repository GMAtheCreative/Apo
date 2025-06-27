import { suiClient } from "../config/suiConfig";
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import { Biodata } from "../models/user";

export class SuiService {
  private packageId = "0xYOUR_PACKAGE_ID"; // Update after deployment
  private moduleName = "datavault";
  private signer: Ed25519Keypair;

  constructor() {
    const privateKey = process.env.SUI_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("SUI_PRIVATE_KEY not set in environment");
    }
    this.signer = Ed25519Keypair.fromSecretKey(fromBase64(privateKey));
  }

  async registerUserOnChain(biodata: Biodata) {
    try {
      const tx = new Transaction();
      tx.setGasBudget(110000);
      tx.setGasPrice(1000);

      tx.moveCall({
        target: `${this.packageId}::${this.moduleName}::register_user`,
        arguments: [
          tx.pure.string(JSON.stringify(biodata.personalInformation)),
          tx.pure.string(JSON.stringify(biodata.educationalBackground)),
          tx.pure.string(JSON.stringify(biodata.professionalSummary)),
          tx.pure.string(JSON.stringify(biodata.workExperience)),
          tx.pure.string(JSON.stringify(biodata.skills)),
        ],
      });

      const result = await suiClient.signAndExecuteTransaction({
        transaction: tx,
        signer: this.signer,
        options: { showObjectChanges: true },
      });

      console.log("Transaction Digest:", result.digest);
      const gasUsed = result.balanceChanges?.find(
        (change) => change.coinType === "0x2::sui::SUI"
      )?.amount;
      console.log(
        "Gas Used (MIST):",
        gasUsed ? Number(gasUsed) * -1 : "Unknown"
      );

      return result;
    } catch (error: any) {
      throw new Error(`Failed to register user on chain: ${error.message}`);
    }
  }

  async getUserByNinOnChain(nationalId: string): Promise<{ biodata: Biodata }> {
  try {
    const tx = new Transaction();
    tx.moveCall({
      target: `${this.packageId}::${this.moduleName}::get_user_by_nin`,
      arguments: [tx.pure.string(nationalId)],
    });

    const result = await suiClient.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: this.signer.getPublicKey().toSuiAddress(),
    });

    const returnValues = result.results?.[0]?.returnValues;
    if (!returnValues || returnValues.length < 1) {
      throw new Error("Failed to extract user data from return values");
    }
    const rawBytes = returnValues[0][0];
    const jsonString = Buffer.from(rawBytes).toString('utf8'); // ✅ Decode it
    const biodata: Biodata = JSON.parse(jsonString); // ✅ Now parse

    return { biodata };
  } catch (error: any) {
    throw new Error(`Failed to get user by NIN on chain: ${error.message}`);
  }
}

}
