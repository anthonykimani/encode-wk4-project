import { expect } from "chai";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { toHex, hexToString, fromHex, parseEther, stringToHex  } from "viem";

const proposalNames = ["Water4Elephants", "Trees4Jamaica", "BeneathTheBaobab"];
const proposalToBytes = proposalNames.map(proposal=> toHex(proposal, {size:32}));

async function fixture() {
    const publicClient = await viem.getPublicClient();
    const [deployer, account1, account2] = await viem.getWalletClients();
    const myTokenContract = await viem.deployContract("MyToken", []);
    const currentBlockNumber = await publicClient.getBlockNumber();
    const snapshotBlockNumber = currentBlockNumber - 6n;
    const tokenBallotContract = await viem.deployContract("TokenizedBallot", [proposalToBytes, myTokenContract.address, snapshotBlockNumber]);
    return {
      publicClient,
      deployer,
      account1,
      account2,
      myTokenContract,
      tokenBallotContract,
      currentBlockNumber
    };
}

describe("TokenizedBallot Contract", async () => {
    describe("When the TokenizedBallot Contract is Deployed", async () => {
      it("defines a contract with a list of proposals", async () => {
        const { tokenBallotContract, publicClient } = await loadFixture(fixture);
        const proposalList = await tokenBallotContract.read.proposals([1n]);
        console.log("ProposalList",proposalList);
        expect(proposalList).to.be.greaterThan(0);
      });
      it("defines a targetBlockNumber", async()=>{
        const { tokenBallotContract, currentBlockNumber } = await loadFixture(fixture);
        const targetBlockNo = tokenBallotContract.read.targetBlockNumber;
        expect(targetBlockNo).to.be.eq(currentBlockNumber);
      })

    });
  });