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

     const ipfsHash = await nosana.ipfs.pin(json_flow);
     console.log('IPFS uploaded!', nosana.ipfs.config.gateway + ipfsHash);

     console.log(0);
     
     const response = await nosana.jobs.list(
          ipfsHash,
          60,
          new PublicKey('97G9NnvBDQ2WpKu6fasoMsAKmfj63C9rhysJnkeWodAf')
     );

     console.log(1);
     
     if ('job' in response) {
          console.log('Job posted!', response);

          let job;
          while (!job || job.state !== 'COMPLETED') {
               console.log('Checking job state...');
               job = await nosana.jobs.get(response.job);
               await sleep(5);
          }

          console.log('Job done!');
          const result = await nosana.ipfs.retrieve(job.ipfsResult);
          console.log(result);
          return result;
     } else {
          console.error('Failed to post job. Response was:', response);
          throw new Error('too much error')
     }
};