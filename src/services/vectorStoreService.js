/*
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from 'dotenv';
dotenv.config();

const client = new Pinecone({apiKey: process.env.PINECONE_API_KEY});
const index = client.index(process.env.PINECONE_INDEX);

export default async function storeEmbedding(docName, embedding, gcpUrl,text){
    await index.upsert([{
        id: docName,
        values: embedding,
        metadata: { source: gcpUrl, text},
    },
])
}

export async function searchRelevantDocs(queryVector, topK = 3){
    const res = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
    });
    return res.matches.map((m) => ({
        score: m.score,
        source: m.metadata.source,
        text: m.metadata.text

    }));
}
*/



// Updated code for COHERE
import dotenv from "dotenv";
dotenv.config();

import Pinecone from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || "us-east1-gcp";
const PINECONE_INDEX = process.env.PINECONE_INDEX;

if (!PINECONE_API_KEY || !PINECONE_INDEX) {
  throw new Error(
    "Pinecone API key or index is missing. Please add them to your .env file."
  );
}

// Initialize Pinecone client with correct property
const client = new Pinecone.Pinecone({
  apiKey: PINECONE_API_KEY,
  controllerHostUrl: `https://${PINECONE_INDEX}-${PINECONE_ENVIRONMENT}.svc.pinecone.io`
});

// Access the index
const index = client.Index(PINECONE_INDEX);

console.log("✅ Pinecone client initialized successfully");

// Store embedding
export default async function storeEmbedding(docName, embedding, gcpUrl, text) {
  await index.upsert([
    {
      id: docName,
      values: embedding,
      metadata: { source: gcpUrl, text },
    },
  ]);
}

// Query index
export async function searchRelevantDocs(queryVector, topK = 3) {
  const res = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });

  return res.matches.map((m) => ({
    score: m.score,
    source: m.metadata.source,
    text: m.metadata.text,
  }));
}
