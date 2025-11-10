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
});

// Access the index
const index = client.Index(PINECONE_INDEX, 
    "https://my-vectordb-v4oukp8.svc.aped-4627-b74a.pinecone.io",
);

console.log("✅ Pinecone client initialized successfully");

// Store embedding
export async function storeEmbedding(docName, embedding, gcpUrl, text) {

    const vector = Array.isArray(embedding[0]) ? embedding[0] : embedding;
    //console.log("vector to store from StoreEmbedding ", vector);

  await index.upsert([
    {
      id: docName,
      values: vector,
      metadata: { source: gcpUrl, text },
    },
  ]);
}

// Query index
export async function searchRelevantDocs(queryVector) {
    const topK = 3;

    if (!Array.isArray(queryVector)) {
        throw new Error(`Query vector must be an array, got: ${typeof queryVector}`);
      }
    
      // If nested, flatten
      const vec = Array.isArray(queryVector[0]) ? queryVector[0] : queryVector;
    
      if (!vec.every((v) => typeof v === "number")) {
        throw new Error("Query vector must be a flat array of numbers");
      }

  const res = await index.query({
    vector: vec,
    topK,
    includeMetadata: true,
  });

  return res.matches.map((m) => ({
    score: m.score,
    source: m.metadata.source,
    text: m.metadata.text,
  }));
}
