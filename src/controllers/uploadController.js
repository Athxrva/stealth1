// uploadfiletogcp
// parsefile
// generateembeddings
// storeembeddings

/*
import  uploadFileToGCP  from '../services/gcpService.js'
import parseFile  from '../utils/fileParser.js'
import generateEmbeddings from '../services/embeddingService.js'
import storeEmbedding  from '../services/vectorStoreService.js'

export default async function handleFileUpload(req,res){
    try{
        const file = req.file;
        if(!file){
            return res.status(400).json({
                error: "No file upploaded"
            });
        }

        const gcpUrl = await uploadFileToGCP(file);

        const text = await parseFile(file);

        const embedding = await generateEmbeddings(text); //check how embeddings work -> OpenAI / Gemini

        await storeEmbedding(file.originalname, embedding, gcpUrl,text );

        res.json({ success: true, gcpUrl });
    }
    catch(e){
        console.error("Upload failed", e);
        res.status(500).json({ error: "File upload failed" });
    }
}
*/

import uploadFileToGCP from '../services/gcpService.js';
import parseFile from '../utils/fileParser.js';
import generateEmbeddings from '../services/embeddingService.js';
import storeEmbedding from '../services/vectorStoreService.js';

export default async function handleFileUpload(req, res) {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Step 1: Upload file to GCP
    const gcpUrl = await uploadFileToGCP(file);

    // Step 2: Parse text from file
    const text = await parseFile(file);
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Uploaded file contains no readable text" });
    }

    // Step 3: Generate embeddings
    const embedding = await generateEmbeddings(text);
    if (!embedding || embedding.length === 0) {
      return res.status(500).json({ error: "Failed to generate embeddings" });
    }

    // Optional: Ensure embedding matches Pinecone index dimension
    const EXPECTED_DIM = 1024; // update if your Pinecone index has a different dimension
    if (embedding.length !== EXPECTED_DIM) {
      return res.status(500).json({
        error: `Embedding dimension mismatch. Expected ${EXPECTED_DIM}, got ${embedding.length}`
      });
    }

    // Step 4: Store embedding in Pinecone
    await storeEmbedding(file.originalname, embedding, gcpUrl, text);

    res.json({ success: true, gcpUrl });
  } catch (e) {
    console.error("Upload failed", e);
    res.status(500).json({ error: "File upload failed" });
  }
}
