import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit'
import  handleFileUpload  from "../controllers/uploadController.js"

const router = express.Router();

const uploadLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    message: { error: "Too many uploads, try again later"},
    standardHeaders: true,
    legacyHeaders: false,
})


const upload = multer({dest: "temp/",
    limits: { fileSize: 10 * 1024 * 1024}
});

function checkMinFileSize(req,res,next){
    const file = req.file;
    if(file && file.size < 10 * 1024){
        return res.status(400).json({ error: "File size must be greater than 10kb" })
    }

    next();
}

router.post("/", upload.single("file"), checkMinFileSize, handleFileUpload);

export default router;