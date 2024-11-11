import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { createCharacter, getCharacters, updateCharacter } from '../controllers/character.controller';

const router = express.Router();

router.post('/', authenticateJWT, createCharacter);
router.get('/', authenticateJWT, getCharacters);
router.put('/:id', authenticateJWT, updateCharacter);

export default router;
