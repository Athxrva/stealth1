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
import axios from 'axios';

dotenv.config();

const COHERE_API_KEY = process.env.COHERE_API_KEY;

if (!COHERE_API_KEY) {
  throw new Error("Cohere API key is missing in .env");
}

console.log('Cohere API key loaded successfully');

export default async function generateEmbeddings(text, useMock = false) {
  // Mock mode for testing
  if (useMock) {
    const embeddingLength = 1024;
    const embedding = Array.from({ length: embeddingLength }, () => Math.random());
    console.log("Mock embeddings generated for text:", text?.slice(0, 50) + "...");
    return embedding;
  }

  // Ensure text is non-empty
  if (!text || !text.trim()) {
    throw new Error("Cannot generate embeddings for empty text");
  }

  try {
    //console log generating embeddings

    // Always send an array of strings
    const payload = {
      model: 'embed-english-v3.0',
      input_type: "search_document",
      texts: [text],
    };

    const response = await axios.post(
      'https://api.cohere.ai/embed',
      payload,
      {
        headers: {
          Authorization: `Bearer ${COHERE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data?.embeddings || response.data.embeddings.length === 0) {
      throw new Error("No embeddings returned from Cohere");
    }

    //console log-> embeddings generated successfully

    const embedding = response.data.embeddings[0];
    
    return embedding;
  } catch (error) {
    console.error(
      "Error generating embeddings:",
      error.response?.data || error.message
    );
    throw error;
  }
}
