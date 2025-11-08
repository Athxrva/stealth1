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
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config();

const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const index = client.index(process.env.PINECONE_INDEX);

export default async function storeEmbedding(docName, embedding, gcpUrl, text) {
    console.log("🔍 [storeEmbedding] Raw embedding type:", typeof embedding);
    console.log("🔍 [storeEmbedding] Is array:", Array.isArray(embedding));
    console.log("🔍 [storeEmbedding] First element type:", Array.isArray(embedding) ? typeof embedding[0] : "N/A");

    // Flatten if Cohere returned [[...]] or wrapped object
    if (Array.isArray(embedding) && Array.isArray(embedding[0])) {
        embedding = embedding[0];
        console.log("✅ [storeEmbedding] Flattened embedding. New length:", embedding.length);
    }

    // Handle edge cases where embedding is inside an object (e.g. { embedding: [...] })
    if (!Array.isArray(embedding) && embedding?.embedding) {
        embedding = embedding.embedding;
        console.log("✅ [storeEmbedding] Extracted embedding from object. New length:", embedding.length);
    }

    // Validate embedding shape
    if (!Array.isArray(embedding) || embedding.length === 0) {
        console.error("❌ Invalid embedding:", embedding);
        throw new Error("Cannot store empty or invalid embedding");
    }

    const INDEX_DIM = 1024; // matches your Pinecone index
    if (embedding.length !== INDEX_DIM) {
        throw new Error(`Embedding dimension mismatch. Expected ${INDEX_DIM}, got ${embedding.length}`);
    }

    const id = `${docName}-${Date.now()}`;
    console.log("📤 [storeEmbedding] Uploading to Pinecone... ID:", id);

    await index.upsert([
        {
            id,
            values: embedding,
            metadata: { source: gcpUrl, text },
        },
    ]);

    console.log("✅ [storeEmbedding] Successfully stored embedding in Pinecone");
}

export async function searchRelevantDocs(queryVector, topK = 3) {
    if (!queryVector || queryVector.length === 0) {
        throw new Error("Query vector is empty");
    }

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
