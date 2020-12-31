import { MongoClient, Database } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';

let db: Database;

export function connect() {
  const client = new MongoClient();
  client.connectWithUri('mongourl');

  db = client.database('notes');
}

export function getDb() {
  return db;
}
