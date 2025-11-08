/*
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY});

export default async function generateAnswerFromContext(question, context){
    const systemPrompt = `
    You are an assistant that answers questions ONLY based on the provided context.
    If the answer is not in the context, say "I do not have enough context`

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
            { role: "system", content: systemPrompt},
            { role: "user", content: `Context:\n${context}\n\nQuestions: ${questions}`},
        ],
        temperature: 0.2,
    })

    return response.choices[0].message.content.trim();
}
*/


// llmService.js
import dotenv from 'dotenv';
dotenv.config();

import { CohereClientV2 } from "cohere-ai";
const cohere = new CohereClientV2({ token: process.env.COHERE_API_KEY });

export default async function generateAnswerFromContext(question, context) {
    const systemPrompt = `
You are an assistant that answers questions ONLY based on the provided context.
If the answer is not in the context, say "I do not have enough context".
`;

    const prompt = `${systemPrompt}\nContext:\n${context}\n\nQuestion: ${question}\nAnswer:`;

    try {
        const response = await cohere.generate({
            model: "command-xlarge-nightly",   // or other model
            prompt: prompt,
            max_tokens: 300,
            temperature: 0.2,
            stop_sequences: ["\n"],
        });
        const answer = response.generations[0].text.trim();
        console.log("Generated answer:", answer);
        return answer;
    } catch (error) {
        console.error("Error generating answer with Cohere:", error);
        return null;
    }
}
