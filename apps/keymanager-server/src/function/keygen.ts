import { PrismaClient as prismaClient1 } from '../../db/db1/generated/prisma1'
import { PrismaClient as prismaClient2 } from '../../db/db2/generated/prisma2'
import { PrismaClient as prismaClient3 } from '../../db/db3/generated/prisma3' 
import { PrismaClient as prismaClient4 } from '../../db/db4/generated/prisma4'
import { PrismaClient as prismaClient5 } from '../../db/db5/generated/prisma5'
import bs58 from 'bs58'
import secp256k1 from "secp256k1";
import { bech32 } from "bech32";
import hdkey from 'hdkey';
import crypto from "crypto";
import { Keypair } from "@solana/web3.js";
import { split, combine } from 'shamir-secret-sharing';

export const db1 = new prismaClient1();
export const db2 = new prismaClient2();
export const db3 = new prismaClient3();
export const db4 = new prismaClient4();
export const db5 = new prismaClient5();

export async function deriveAkashAddress(memonicsSeed: Buffer) {
     const root = hdkey.fromMasterSeed(memonicsSeed);
     const keyPair = root.derive("m/44'/118'/0'/0/0");

     const publicKey = secp256k1.publicKeyConvert(keyPair.publicKey!, true);

     // Hashing (SHA256 → RIPEMD160)
     const sha256Hash = crypto.createHash("sha256").update(publicKey).digest();
     const ripemdHash = crypto.createHash("ripemd160").update(sha256Hash).digest();

     const words = bech32.toWords(ripemdHash);

     const akashAddress = bech32.encode("akash", words);

     const encodedPub =  bs58.encode(publicKey);
     const [p1, p2, p3, p4, p5] = await split(new Uint8Array(keyPair.privateKey!), 5, 3);
     try {
          await db1.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p1!)
               }
          })
          
          await db2.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p2!)
               }
          })
          await db3.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p3!)
               }
          })
          await db4.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p4!)
               }
          })

          await db5.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p5!)
               }
          })
     } catch(e) {
          console.error(e)
     }
     return { akashAddress, encodedPub }
}

export async function deriveSolAddress(memonicsSeed: Buffer) {
     const path = `m/44'/501'/0'/0'`
     const root = hdkey.fromMasterSeed(memonicsSeed)
     const derived = root.derive(path); 

     const pair = Keypair.fromSeed(derived.privateKey!)
     const privateKey = pair.secretKey;
     const publicKey = pair.publicKey

     const [p1, p2, p3, p4, p5] = await split(privateKey, 5, 3);
     const encodedPub = publicKey.toBase58();
     try {
          await db1.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p1!)
               }
          })
          
          await db2.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p2!)
               }
          })
          await db3.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p3!)
               }
          })
          await db4.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p4!)
               }
          })

          await db5.privateKey.create({
               data : {
                    pubkey: encodedPub,
                    pvtKey: Buffer.from(p5!)
               }
          })
     } catch(e) {
          console.error(e)
     }
     return { encodedPub };
}
