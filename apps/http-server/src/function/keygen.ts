import bip39, { generateMnemonic, mnemonicToSeedSync  } from "bip39";
import bs58 from 'bs58'
import hdkey from "hdkey";
import secp256k1 from "secp256k1";
import { bech32 } from "bech32";
import crypto from "crypto";
import { Keypair } from "@solana/web3.js";

const memonics = generateMnemonic()

const memoSeed = mnemonicToSeedSync(memonics);



export async function deriveAkashAddress(memonicsSeed: Buffer) {
     const root = hdkey.fromMasterSeed(memonicsSeed);
     const keyPair = root.derive("m/44'/118'/0'/0/0");


     // Get public key in compressed format
     const publicKey = secp256k1.publicKeyConvert(keyPair.publicKey!, true);
     console.log(publicKey);


     // Hashing (SHA256 → RIPEMD160)
     const sha256Hash = crypto.createHash("sha256").update(publicKey).digest();
     const ripemdHash = crypto.createHash("ripemd160").update(sha256Hash).digest();

     const words = bech32.toWords(ripemdHash);
     
     const akashAddress = bech32.encode("akash", words);

     console.log("Akash Address:", akashAddress);
     console.log("Private Key (hex):", keyPair.privateKey?.toString("hex"));

     const message = "Hello Akash!";
     const messageHash = crypto.createHash("sha256").update(message).digest();

     const sigObj = secp256k1.ecdsaSign(messageHash, keyPair.privateKey!);
     const signature = sigObj.signature;

     const isValid = secp256k1.ecdsaVerify(signature, messageHash, publicKey);

     console.log("Signature Valid:", isValid);
}

export async function deriveSolAddress() {
     const path = `m/44'/501'/0'/0'`
     const root = hdkey.fromMasterSeed(memoSeed)
     const derived = root.derive(path); 

     const pair = Keypair.fromSeed(derived.privateKey!)
     const privateKey = pair.secretKey;
     const publicKey = pair.publicKey

     const encodedPrivate =  bs58.encode(privateKey);
     const encodedPublic = publicKey.toBase58();

     console.log({
          encodedPublic,
          encodedPrivate
     });
}
