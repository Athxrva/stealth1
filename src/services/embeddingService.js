/*import dotenv from 'dotenv';
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

export default async function generateEmbeddings(text){

    //generate mock embeddings

    const embeddingLength = 1024;
    const embedding = Array.from({ length: embeddingLength }, ()=>Math.random());
    console.log("Mock embeddings generated for text: ", text.slice(0,50) + "...");

    return embedding;


    //------------------------------

    // Code snippet to create text embeddings via OpenAI 

    // const response = await openai.embeddings.create({
    //     model:'text-embedding-3-small',
    //     input: text,
    //})
    //
    //return response.data[0].embedding;
}*/

// Cohere LLM
//
import dotenv from 'dotenv';
dotenv.config();

import { CohereClientV2 } from 'cohere-ai';
const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

export default async function generateEmbeddings(text, useMock = false) {
  if (useMock) {
    const embeddingLength = 1024;
    const embedding = Array.from({ length: embeddingLength }, () => Math.random());
    console.log("Mock embeddings generated for text:", text.slice(0, 50) + "...");
    return embedding;
  }

  try {
    const response = await cohere.embed({
      model: 'embed‑english‑v4.0',  // adjust to model you choose
      input_type: 'search_document', // or 'search_query', 'classification', 'clustering' depending on your use case
      texts: [text],                // or use `inputs` if mixing text/image
      // optionally: embedding_types: ['float'], truncate: 'END'
    });

    const embedding = response.embeddings[0];
    console.log("Cohere embeddings generated for text:", text.slice(0, 50) + "...");
    return embedding;

  } catch (error) {
    console.error("Error generating embeddings:", error);
    return null;
  }
}
