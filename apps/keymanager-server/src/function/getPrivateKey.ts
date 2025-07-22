import { db1, db2, db3, db4, db5 } from '../config/config';
import { combine } from 'shamir-secret-sharing';

export const getPrivateKey = async (publicKey: string) => {
     const arrPart = []
     try {
          const res = await db1.privateKey.findFirst({
               where: {
                    pubkey: publicKey
               }
          })

          if(res) {
               const p1 = res.pvtKey;
               arrPart.push(new Uint8Array(p1));
          }
     } catch (e) {
          console.error('p1 not found')
     }

     try {
          const res = await db2.privateKey.findFirst({
               where: {
                    pubkey: publicKey
               }
          })

          if(res) {
               const p2 = res.pvtKey;
               arrPart.push(new Uint8Array(p2));
          }
     } catch (e) {
          console.error('p2 not found')
     }
     try {
          const res = await db3.privateKey.findFirst({
               where: {
                    pubkey: publicKey
               }
          })

          if(res) {
               const p3 = res.pvtKey;
               arrPart.push(new Uint8Array(p3));
          }
     } catch (e) {
          console.error('p3 not found')
     }
     try {
          const res = await db4.privateKey.findFirst({
               where: {
                    pubkey: publicKey
               }
          })

          if(res) {
               const p4 = res.pvtKey;
               arrPart.push(new Uint8Array(p4));
          }
     } catch (e) {
          console.error('p4 not found')
     }

     try {
          const res = await db5.privateKey.findFirst({
               where: {
                    pubkey: publicKey
               }
          })

          if(res) {
               const p5 = res.pvtKey;
               arrPart.push(new Uint8Array(p5));
          }
     } catch (e) {
          console.error('p5 not found')
     }

     if(arrPart.length < 3) {
          return null;
     }
     const privateKey = await combine(arrPart);
     
     return privateKey
}