import { Injectable } from '@nestjs/common';
import * as myTokenJson from '../assets/MyToken.json';
import {
  createPublicClient,
  createWalletClient,
  formatEther,
  http,
} from 'viem';
import * as chains from 'viem/chains';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';
dotenv.config();

const { ALCHEMY_API_KEY, METAMASK_PRIVATE_KEY } = process.env;

@Injectable()
export class AppService {
  publicClient;
  walletClient;

  constructor(private configService: ConfigService) {
    this.publicClient = createPublicClient({
      chain: chains.sepolia,
      transport: http(
        this.configService.get<string>(
          `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ''}`,
        ),
      ),
    });
    this.walletClient = createWalletClient({
      chain: chains.sepolia,
      transport: http(
        this.configService.get<string>(
          `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY ?? ''}`,
        ),
      ),
      key: METAMASK_PRIVATE_KEY ?? '',
    });
  }

  getVotingDapp(): string {
    return 'This is the Nest Backend to Voting Dapp';
  }

  getContractAddress(): string {
    return '0x86491e2487b1909b2e6b8493e081a18ee5c1005a';
  }

  async getTokenName(): Promise<any> {
    const name = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: myTokenJson,
      functionName: 'name',
    });
    return name;
  }

  async getTotalSupply(): Promise<any> {
    const totalSupply = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: myTokenJson,
      functionName: 'totalSupply',
    });
    return formatEther(totalSupply as bigint);
  }

  async getTokenBalance(address: string): Promise<any> {
    const tokenBalance = await this.publicClient.readContract({
      address: this.getContractAddress() as `0x${string}`,
      abi: myTokenJson,
      functionName: 'balanceOf',
      args: [address],
    });
    return formatEther(tokenBalance as bigint);
  }

  async getTransactionReceipt(hash: string): Promise<any> {
    const transactionReceipt = await this.publicClient.getTransactionReceipt({
      hash,
    });
    return transactionReceipt;
  }
}
