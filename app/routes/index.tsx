import axios from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import Button from "~/components/UI/Button";
import Input from "~/components/UI/Input";
import Loading from "~/components/UI/Loading";
import { generateKeyPair, generateSignature } from "~/helpers/crypto";
import db from "~/indexedDB/db";

export default function Index() {
  const [loading, setLoading] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  const passpharaseRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    db.transaction("r", db.keys, async () => {
      const cursor = await db.keys.get(1);
      if (cursor) {
        if (cursor.privateKey) {
          if (cursor.privateKey.length > 0) {
            setHasKey(true);
          }
        } else {
          throw new Error("Index DB: no keys");
        }
      } else {
        throw new Error("Index DB: no keys");
      }
    });
  }, []);

  const handleSignup = async (event: FormEvent) => {
    setLoading(true);
    event.preventDefault(); // Preventing Form Default Behaviour

    const pass: string =
      passpharaseRef.current?.value.trim().replace(/ /g, "") || "";
    if (pass.length > 0 && typeof document !== "undefined") {
      //Cleaning Passphrase from potential white spaces

      //Generating Asymmetric KeyPair
      const keys = await generateKeyPair(pass);

      if (keys == null) return;

      //Storing Private Key and Revocation Certificate locally
      db.transaction("rw", db.keys, async () => {
        return await db.keys.update(1, {
          privateKey: keys.privateKey,
          revocationCertificate: keys.revocationCertificate,
        });
      });

      //Sending Public Key to Vault Server
      const response = await axios.post("http://localhost:8080/signup", {
        public_key: keys.publicKey,
      });

      console.log(response.data);
    }
    setLoading(false);
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault(); // Preventing Form Default Behaviour

    const pass: string =
      passpharaseRef.current?.value.trim().replace(/ /g, "") || "";
    if (pass.length > 0 && typeof document !== "undefined") {
      try {
        const { message, signature } = await generateSignature(pass);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="flex w-full h-screen flex-col items-center justify-center">
      {!loading && (
        <form
          className="p-3 bg-gray-500 flex flex-col w-[66%] justify-center"
          onSubmit={hasKey ? handleLogin : handleSignup}
        >
          <Input
            id="passphrase"
            label={"Enter" + hasKey ? " your " : " a " + "Master Passphrase"}
            type="text"
            ref={passpharaseRef}
          ></Input>

          <Button type="submit">
            {hasKey ? "Login" : "Create Secure Vault"}
          </Button>
        </form>
      )}
      {loading && <Loading />}
    </div>
  );
}
