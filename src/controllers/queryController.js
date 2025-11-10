
import  generateEmbeddings  from "../services/embeddingService.js";
import  { searchRelevantDocs } from "../services/vectorStoreService.js";
import  generateAnswerFromContext  from "../services/llmService.js";


export default async function handleQuery(req,res){
    try{
        const { question } = req.body;
        if(!question){
            return res.status(400).json({
                error: "Question required"
            });
        }

        const queryVector = await generateEmbeddings(question);

        

        const relevantDocs = await searchRelevantDocs(queryVector);

        const context = relevantDocs.map((d,i) => `Document ${i+1}:\n${d.text}`).join("\n\n");

        const answer = await generateAnswerFromContext(question,context);

        res.json({
            success: true,
            answer,
            sources: relevantDocs.map((d) => d.source)
        });
    }
    catch(e){
        console.error("Query failed: ", e);
        res.status(500).json({error: "Query failed"});
    }
}