import { createClients } from "./helpers";
import { parseEther, formatEther, toHex } from "viem";
import {
  abi,
  bytecode,
} from "../artifacts/contracts/MyToken.sol/MyToken.json";

async function main() {
  // Get PublicClient and WalletClient from helpers
  const { deployer, publicClient } = createClients();

  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error(
      "Usage: ts-node mintTokens.ts <recipient_address> <token_amount>"
    );
  }
  const recipientAddress = args[0];
  const tokenAmount = parseEther(args[1]);

  try {
    const mintHash = await deployer.writeContract({
      address: "0x86491e2487b1909b2e6b8493e081a18ee5c1005a",
      abi: abi,
      functionName: "mint",
      args: [recipientAddress, tokenAmount],
    });

    // Get Contract Hash
    console.log("\nTransaction hash:", mintHash);
    console.log("Waiting for confirmations...");

    await publicClient.waitForTransactionReceipt({
      hash: mintHash,
    });

    const mintedTokens = await publicClient.readContract({
        address: "0x86491e2487b1909b2e6b8493e081a18ee5c1005a",
        abi,
        functionName: "balanceOf",
        args:[recipientAddress]
    })
    console.log(`\n ${mintedTokens} Tokens minted successfully to address ${recipientAddress}.`);
  } catch (error) {
    console.error("Failed to mint tokens:", error);
  }

  // Optionally, check and log the deployer's balance
  const balance = await publicClient.getBalance({
    address: deployer.account.address,
  });
  console.log(
    "\nDeployer balance:",
    formatEther(balance),
    deployer.chain.nativeCurrency.symbol
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
