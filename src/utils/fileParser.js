import fs from 'fs';

import  { readFileSync }  from "fs";
import * as docx from 'docx-parser';
import pkg from 'pptx2json'
const { parse } = pkg;

import { PdfReader } from "pdfreader";


export default async function parseFile(file){
    const ext = file.originalname.split(".").pop();

    if(ext === "pdf"){
        return await new Promise((resolve,reject) => {
            const texts = [];

            new PdfReader().parseFileItems(file.path,(err,item)=>{
                if(err) return reject(err);
            if(!item){
                resolve(texts.join(" "));
            }
            else if(item.text){
                texts.push(item.text);
            }
            });
            
        });
    }

    if(ext === "docx"){
        return new Promise((resolve,reject) => {
            docx.parseDocx(file.path, (data) => resolve(data));
        });
    }

    if( ext === "pptx" ){
        const data = await parse(file.path);
        return data.slides.map(slide => slide.text).join('\n');
    }

    throw new Error("Unsupported file format");
}