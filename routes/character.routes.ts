import express from 'express';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import {createCharacter, deleteCharacter, getCharacters, updateCharacter} from '../controllers/character.controller';
import {deleteCharacterPhoto, getCharacterPhoto, uploadCharacterPhoto} from "../controllers/photo.controller";

const router = express.Router();

router.post('/', authenticateJWT, createCharacter);
router.get('/', authenticateJWT, getCharacters);
router.put('/:id', authenticateJWT, updateCharacter);
router.delete('/:id', authenticateJWT, deleteCharacter);
router.post('/:id/photo', authenticateJWT, uploadCharacterPhoto);
router.get('/:id/photo', authenticateJWT, getCharacterPhoto);
router.delete('/:id/photo', authenticateJWT, deleteCharacterPhoto);

export default router;
