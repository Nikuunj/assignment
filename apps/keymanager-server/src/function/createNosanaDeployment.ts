import { PublicKey } from '@solana/web3.js';

export const createNosanaDeployment = async (privateKey: string) => {
     const { Client, sleep } = await import('@nosana/sdk');

     const config = {
          solana: {
               network: 'https://api.devnet.solana.com',
               priority_fee: 10000,
               dynamicPriorityFee: false,
          },
     };

     const nosana = new Client('devnet', privateKey, config);

     const json_flow = {
          version: '0.1',
          type: 'container',
          meta: {
               trigger: 'cli',
          },
          ops: [
               {
                    type: 'container/run',
                    id: 'hello-world',
                    args: {
                         cmd: 'echo hello world',
                         image: 'ubuntu',
                    },
               },
          ],
     };

     try {
          const ipfsHash = await nosana.ipfs.pin(json_flow);
          console.log('IPFS uploaded:', nosana.ipfs.config.gateway + ipfsHash);

          const response = await nosana.jobs.list(
               ipfsHash,
               60,
               new PublicKey('97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf')
          );

          if (!('job' in response)) {
               throw new Error('Failed to post job: Invalid response');
          }

          console.log('Job posted with ID:', response.job);

          let job;
          while (!job || job.state !== 'COMPLETED') {
               console.log('Polling job state...');
               job = await nosana.jobs.get(response.job);
               await sleep(5000); // 5 seconds in milliseconds
          }

               console.log('Job completed!');

          if (!job.ipfsResult) {
               throw new Error('Job completed, but no IPFS result found.');
          }

          const result = await nosana.ipfs.retrieve(job.ipfsResult);
          console.log('Job Result:', result);

          return result;
     } catch (err) {
          console.error('Error during Nosana deployment:', err);
          throw err;
     }
};
