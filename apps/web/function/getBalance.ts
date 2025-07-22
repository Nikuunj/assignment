import axios from 'axios';
const NOSANA_MINT = 'NosA9iSgxUnKZ2tbSgF1bMZsRAeUdw7AYC5W4b8Z4iE';

export async function getAkashBalance(address: string): Promise<number> {
     try {
          const response = await axios.get(
               `https://akash.api.explorers.guru/cosmos/bank/v1beta1/balances/${address}`
          );

          const balances = response.data?.balances || [];
          const uakt = balances.find((b: any) => b.denom === 'uakt')?.amount || '0';

          return Number(uakt) / 1_000_000; // Convert from uakt to AKT
     } catch (error) {
          console.error('Error fetching Akash balance:', error);
          return 0;
     }
}



export async function getNosanaBalance(walletAddress: string): Promise<number> {
     try {
          const response = await axios.post('https://api.mainnet-beta.solana.com', {
               jsonrpc: '2.0',
               id: 1,
               method: 'getTokenAccountsByOwner',
               params: [
               walletAddress,
               {
                    mint: NOSANA_MINT,
               },
               {
                    encoding: 'jsonParsed',
               },
               ],
          });

          const accounts = response.data?.result?.value || [];

          if (accounts.length === 0) return 0;

          const amount = accounts[0].account.data.parsed.info.tokenAmount.amount;
          const decimals = accounts[0].account.data.parsed.info.tokenAmount.decimals;

          return Number(amount) / 10 ** decimals;
     } catch (error) {
          console.error('Error fetching Nosana balance:', error);
          return 0;
     }
}