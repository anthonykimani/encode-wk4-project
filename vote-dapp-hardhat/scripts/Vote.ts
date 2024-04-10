import { parseEther, formatEther } from "viem";
import { createClients } from "./helpers";
import { abi as MyTokenAbi } from "../artifacts/contracts/MyToken.sol/MyToken.json";
import { abi as TokenizedBallotAbi } from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

async function main() {
  // 1. Get public and wallet clients
  const { publicClient, deployer } = createClients();

  // 2. Get Proposal and Token amount inputs from voter (msg.sender)
  // Get command line arguments
  const args = process.argv.slice(2);
  if (args.length !== 2) {
    throw new Error("Usage: ts-node Vote.ts <proposal_index> <token_amount>");
  }

  const proposalIndex = args[0];
  const tokenAmount = parseEther(args[1]);

  const tokenBalance = await publicClient.readContract({
    address: "0x86491e2487b1909b2e6b8493e081a18ee5c1005a",
    abi: MyTokenAbi,
    functionName: "balanceOf",
    args:[deployer.account.address]
  })
  console.log("\nDeployer Token balance:", tokenBalance);

  // 3. Call the Vote Function
  try {
    const voteHash = await deployer.writeContract({
      address: "0x9e7dc22c3e2072424dfc1c099d44ecefafb080c2",
      abi: TokenizedBallotAbi,
      functionName: "vote",
      args: [proposalIndex, tokenAmount],
    });
    console.log(`\n Vote cast with ${tokenAmount} Tokens `);

    // 4. Get the Transaction Receipt and Hash
    // Get Contract Hash
    console.log("\nTransaction hash:", voteHash);
    console.log("Waiting for confirmations...");

    await publicClient.waitForTransactionReceipt({
      hash: voteHash,
    });
  } catch (error) {
    console.error("Failed to cast vote:", error);
  }

  // 5. Get the Voters Token amount
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
