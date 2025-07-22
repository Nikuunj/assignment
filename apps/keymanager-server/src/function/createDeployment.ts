import fs from "fs";
import path from "path";
import { fromHex } from "@cosmjs/encoding";
import {
  DirectSecp256k1Wallet,
  Registry,
  EncodeObject,
} from "@cosmjs/proto-signing";
import {
  DeliverTxResponse,
  SigningStargateClient,
  StargateClient,
} from "@cosmjs/stargate";
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import { MsgCreateDeployment } from "@akashnetwork/akash-api/akash/deployment/v1beta3";
import { MsgCreateLease, QueryClientImpl as MarketQueryClient } from "@akashnetwork/akash-api/akash/market/v1beta4";

import { getAkashTypeRegistry } from "@akashnetwork/akashjs/build/stargate";

const AKASH_RPC = "https://rpc.akash.forbole.com:443";
const SDL_PATH = path.join(__dirname, "deploy.yml");

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export async function createDeploymentWithKey(privateKeyHex: string) {
    const wallet = await DirectSecp256k1Wallet.fromKey(fromHex(privateKeyHex), "akash");
    const [account] = await wallet.getAccounts();
    if (!account) throw new Error("Wallet account not found");
    const address = account.address;

    const registry = new Registry(getAkashTypeRegistry());
    const client = await SigningStargateClient.connectWithSigner(AKASH_RPC, wallet, { registry });

    console.log("✅ Connected to Akash as:", address);

    const sdlContent = fs.readFileSync(SDL_PATH, "utf-8");

    const dseq = Date.now().toString();
    
    const msgCreateDeployment: EncodeObject = {
        typeUrl: "/akash.deployment.v1beta3.MsgCreateDeployment",
        value: MsgCreateDeployment.fromPartial({
        id: { 
            owner: address, 
            dseq: dseq 
        },
        groups: [],
        version: Buffer.from("v1"),
        depositor: address,
        }),
    };

    const fee = {
        amount: [{ denom: "uakt", amount: "500000" }],
        gas: "200000",
    };

    console.log("📦 Creating deployment...");
    const txCreate: DeliverTxResponse = await client.signAndBroadcast(
        address,
        [msgCreateDeployment],
        fee
    );
    if (txCreate.code !== 0) throw new Error(`Deployment Tx failed: ${txCreate.rawLog}`);
    console.log("Deployment created. dseq =", dseq.toString());

    console.log("Waiting for provider bids...");
    await sleep(6000);
    const provider = "akash1provideraddressxxxxxxxxxxxxxxx"; 
    if (!provider) throw new Error("No provider bids received");

    // Create Lease
    const msgLease: EncodeObject = {
        typeUrl: "/akash.market.v1beta4.MsgCreateLease",
        value: MsgCreateLease.fromPartial({
        bidId: {
            owner: address,
            dseq: dseq,
            gseq: 1,
            oseq: 1,
            provider,
        },
        }),
    };

    console.log("Creating lease...");
    const txLease = await client.signAndBroadcast(address, [msgLease], fee);
    if (txLease.code !== 0) throw new Error(`Lease Tx failed: ${txLease.rawLog}`);


    await sleep(5000);
    const tendermintClient = await Tendermint34Client.connect(AKASH_RPC);
    const queryClient = new QueryClient(tendermintClient);
    
    const rpc = createProtobufRpcClient(queryClient);
    const marketQuery = new MarketQueryClient(rpc);
    
    return {
        dseq: dseq.toString(),
        provider,
        uri: null,
        lease: null,
        note: "Lease created successfully. Query lease status separately if needed.",
    };
}