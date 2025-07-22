// deploy.ts

import { execSync } from "child_process";

const AKASH_NODE = "https://rpc.akash.forbole.com:443";
const DEPLOY_YML_URL = "https://raw.githubusercontent.com/maxmaxlabs/hello-akash-world/master/deploy.yml";

export const createDeployment = async (akashKeyName: string, akashAccountAddress: string) => {
    try {
    
        execSync(`curl -s ${DEPLOY_YML_URL} > deploy.yml`);

    
        const createOutput = execSync(
            `provider-services tx deployment create deploy.yml --from ${akashKeyName} --node ${AKASH_NODE} --keyring-backend test --gas auto --gas-prices 0.025uakt --yes`
        ).toString();

        const dseqMatch = createOutput.match(/"dseq","value":"(\d+)"/);
        if (!dseqMatch) throw new Error("DSEQ not found in deployment response.");
        const AKASH_DSEQ = dseqMatch[1];

        
        const bidsRaw = execSync(
            `provider-services query market bid list --owner=${akashAccountAddress} --node ${AKASH_NODE} --dseq ${AKASH_DSEQ} --state=open`
        ).toString();
        const bidsJson = JSON.parse(bidsRaw);
        const provider = bidsJson.bids?.[0]?.bid?.bid_id?.provider;
        if (!provider) throw new Error("No open bids found.");

        
        execSync(
            `provider-services tx market lease create --dseq ${AKASH_DSEQ} --gseq 1 --oseq 1 --provider ${provider} --from ${akashKeyName} --node ${AKASH_NODE} --keyring-backend test --yes`
        );


        execSync(
            `provider-services send-manifest deploy.yml --dseq ${AKASH_DSEQ} --provider ${provider} --from ${akashKeyName} --node ${AKASH_NODE} --keyring-backend test`
        );

        const statusRaw = execSync(
            `provider-services lease-status --dseq ${AKASH_DSEQ} --from ${akashKeyName} --provider ${provider} --node ${AKASH_NODE}`
        ).toString();
        const status = JSON.parse(statusRaw);
        const uri = status?.services?.web?.uris?.[0];

        if (!uri) throw new Error("Deployment URI not found.");

        return { uri, dseq: AKASH_DSEQ, provider };

    } catch (err: any) {
        console.error("Deployment error:", err.message || err);
        throw new Error(err.message || "Unknown error occurred");
    }
};