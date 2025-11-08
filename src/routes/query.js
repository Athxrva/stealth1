
import express from 'express';
import rateLimit from 'express-rate-limit'
import  handleQuery  from "../controllers/queryController.js"

const router = express.Router();

const queryLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: {
        error: "Too many uploads, please wait for 1 min"
    },
    standardHeaders: true,
    legacyHeaders: false,
})

router.post("/", queryLimiter, handleQuery);

export default router;