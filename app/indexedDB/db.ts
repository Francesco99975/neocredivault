import Dexie, { Table } from "dexie";

interface Keys {
  id?: number;
  privateKey?: string;
  revocationCertificate?: string;
}

//
// Declare Database
//
class KeysDatabase extends Dexie {
  public keys!: Table<Keys, number>; // id is number in this case

  public constructor() {
    super("KeysDatabase");
    this.version(1).stores({
      keys: "++id,privateKey,revocationCertificate",
    });
  }
}

const db = new KeysDatabase();

db.transaction("rw", db.keys, async () => {
  if (!(await db.keys.get(1))) {
    return await db.keys.add({
      privateKey: "",
      revocationCertificate: "",
    });
  }
});

export default db;
