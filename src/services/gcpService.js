import { Storage } from '@google-cloud/storage';
import path from "path";
import dotenv from 'dotenv';

dotenv.config();

const storage = new Storage();
const bucketName = process.env.GCP_BUCKET_NAME;

export default async function uploadFileToGCP(file){

    const destination = `uploads/${Date.now()}_${path.basename(file.originalname)}`;
    await storage.bucket(bucketName).upload(file.path, { destination });

    return `gs://${bucketName}/${destination}`;
}