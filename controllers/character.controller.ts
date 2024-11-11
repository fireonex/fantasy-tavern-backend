import { Request, Response } from 'express';
import Character from '../models/character.model';

// Создание персонажа
export async function createCharacter(req: Request, res: Response): Promise<void> {
    try {
        const { name, age, gender, traits, socialClass, backstory } = req.body;
        const userId = (req as any).userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (!name || !age || !gender || !socialClass) {
            res.status(400).json({ message: 'Name, age, gender, and social class are required' });
            return;
        }

        const newCharacter = new Character({
            userId,
            name,
            age,
            gender,
            traits,
            socialClass,
            backstory,
        });

        await newCharacter.save();
        res.status(201).json({ message: 'Character successfully created', characterId: newCharacter._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// Получение всех персонажей пользователя
export async function getCharacters(req: Request, res: Response): Promise<void> {
    try {
        const userId = (req as any).userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const characters = await Character.find({ userId });
        res.status(200).json(characters);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// Обновление персонажа
export async function updateCharacter(req: Request, res: Response): Promise<void> {
    try {
        const characterId = req.params.id;
        const userId = (req as any).userId;
        const { name, age, gender, traits, socialClass, backstory } = req.body;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const updatedCharacter = await Character.findOneAndUpdate(
            { _id: characterId, userId },
            { name, age, gender, traits, socialClass, backstory },
            { new: true }
        );

        if (!updatedCharacter) {
            res.status(404).json({ message: 'Character not found' });
            return;
        }

        res.status(200).json(updatedCharacter);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// Удаление персонажа
export async function deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
        const characterId = req.params.id;
        const userId = (req as any).userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const deletedCharacter = await Character.findOneAndDelete({ _id: characterId, userId });

        if (!deletedCharacter) {
            res.status(404).json({ message: 'Character not found' });
            return;
        }

        res.status(200).json({ message: 'Character successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}
