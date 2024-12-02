import express from "express";
import {continueDialogue, exitTavern} from "../controllers/dialogue.controller";


const router = express.Router();

router.post('/dialogue/continue', continueDialogue);
router.delete('/dialogue/end', exitTavern)

export default router;
