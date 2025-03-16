import { MongoClient } from "mongodb";

// URL do seu banco de dados MongoDB (ajuste conforme necessário)
const uri = "mongodb://localhost:27017"; // Exemplo local

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // Durante o desenvolvimento, use um cache de conexão.
  let globalWithMongo = global;
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = MongoClient.connect(uri);
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Produção (sempre cria uma nova conexão)
  clientPromise = MongoClient.connect(uri);
}

export async function conectarMongo() {
  if (!client) {
    client = await clientPromise;
  }
  return client.db('agenda-facil'); // Nome do banco de dados
}
