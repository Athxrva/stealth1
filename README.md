This project has the following features:
1) Uploads a file pdf/ppt/docx to GCP storage with the size limit 10kb-10mb
2) The readings of the uploaded file are stored in a vector DB (DB used: Pinecone, LLM: COHERE)
3) APIs are rate-limited to recurrent API calls
4) Users can RAG on the data storage

AI tools used in the development:
Initially - none,
Cursor + Chatgpt - To update the codebase and replace the LLM dependency on OpenAI by Cohere.

Problems faced:
OpenAI token quota exhausted during API testing

Solution:
Replaced OpenAI LLM with cheaper alternatives

NOTES:
The code snippet for OpenAI LLM integration still exists in the code base, please feel free to use it if preferred.

Sample .env file:
PORT=3000
OPENAI_API_KEY=<your-api-key>
GCP_BUCKET_NAME=<your-bucket-name>
PINECONE_API_KEY=<your-api-key>
PINECONE_INDEX=<your-index-name>
GOOGLE_APPLICATION_CREDENTIALS=<your-api-creds>
COHERE_API_KEY=8<your-api-key>
