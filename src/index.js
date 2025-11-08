import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 0;

import uploadRoutes from './routes/upload.js'
import queryRoutes from './routes/query.js'

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/query", queryRoutes);



app.listen(PORT, () => {
    `Server running on port ${PORT}`
});
