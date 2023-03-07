import {
  generateKey,
  sign,
  decryptKey,
  readPrivateKey,
  createMessage,
  readSignature,
} from "openpgp";
import { DeviceUUID } from "device-uuid";
import db from "~/indexedDB/db";

export const generateKeyPair = async (passpharase: string) => {
  if (typeof document !== "undefined") {
    const deviceID = new DeviceUUID().get();

    const { privateKey, publicKey, revocationCertificate } = await generateKey({
      type: "ecc",
      curve: "ed25519",
      userIDs: [{ name: deviceID }],
      passphrase: passpharase,
      format: "armored",
    });

    return { privateKey, publicKey, revocationCertificate };
  }

  return null;
};

export const generateSignature = async (passphrase: string) => {
  return await db.transaction("r", db.keys, async () => {
    const cursor = await db.keys.get(1);

    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: cursor!.privateKey! }),
      passphrase,
    });

    const message = await createMessage({ text: getRandomMessage(50) });
    const detachedSignature = await sign({
      message,
      signingKeys: privateKey,
      detached: true,
    });

    const signature = await readSignature({
      armoredSignature: detachedSignature, // parse detached signature
    });

    return { message, signature };
  });
};

const getRandomMessage = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

// const generateKeyPairUnsecured = async (devID: string) => {
//   const { privateKey, publicKey, revocationCertificate } = await generateKey({
//     type: "ecc",
//     curve: "ed25519",
//     userIDs: [{ name: devID }],
//     format: "armored",
//   });

//   return { privateKey, publicKey, revocationCertificate };
// };
