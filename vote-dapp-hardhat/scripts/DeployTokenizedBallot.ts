import { toHex, hexToString, fromHex, parseEther, stringToHex } from "viem";
import { createClients } from "./helpers";
import {
  abi,
  bytecode,
} from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";

async function main() {
  // Array of Proposals
  const proposalNames = [
    "Water4Elephants",
    "Trees4Jamaica",
    "BeneathTheBaobab",
  ];

  // convert the ProposalNames to Bytes32
  const proposalToBytes = proposalNames.map((proposal) =>
    toHex(proposal, { size: 32 })
  );

  // Get PublicClient and WalletClient from helpers
  const { deployer, publicClient } = createClients();

  // Gets current Block Number
  const currentBlockNumber = await publicClient.getBlockNumber();

  // Gets a snapshot Block Number
  const snapshotBlockNumber = currentBlockNumber - 6n;

  //  use viem's deploycontract function to deploy
  console.log("\nDeploying TokenizedBallot contract");
  const hash = await deployer.deployContract({
    abi: abi,
    bytecode: bytecode as `0x${string}`,
    args: [
      proposalToBytes,
      "0x86491e2487b1909b2e6b8493e081a18ee5c1005a",
      snapshotBlockNumber,
    ],
  });

  // Get Contract Hash
  console.log("\nTransaction hash:", hash);
  console.log("Waiting for confirmations...");

  // Get Contract Address
  const txReceipt = await publicClient.waitForTransactionReceipt({ hash });
  console.log(
    "\nTokenizedBallot contract deployed to:",
    txReceipt.contractAddress
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
