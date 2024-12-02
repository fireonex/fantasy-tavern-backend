import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Character from '../models/character.model';
import upload from "../middlewares/uploadGridFS";

type Params = {
    id: string;
}

type PhotoRequestBody = {
    file?: {
        id: string;
    };
}

type TypedRequest<TParams = {}, TBody = {}> = Request<TParams, any, TBody>;

export const uploadCharacterPhoto = (
    req: TypedRequest<Params, PhotoRequestBody>,
    res: Response
): void => {
    const characterId = req.params.id;

    upload.single('photo')(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Photo upload failed', error: err });
        }

        try {
            const character = await Character.findById(characterId);

            if (!character) {
                return res.status(404).json({ message: 'Character not found' });
            }

            // Удаляем старое фото, если оно существует
            if (character.photo) {
                const db = mongoose.connection.db;
                // @ts-ignore
                const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'characterPhotos' });
                await bucket.delete(new mongoose.Types.ObjectId(character.photo));
            }

            // Обновляем ID фото в персонаже
            // @ts-ignore
            character.photo = req.file?.id as string;
            await character.save();

            res.status(200).json({ message: 'Photo uploaded successfully', photoId: character.photo });
        } catch (err) {
            res.status(500).json({ message: 'Error updating character with photo', error: err });
        }
    });
};

// Получение фото
export const getCharacterPhoto = async (
    req: TypedRequest<Params>,
    res: Response
): Promise<void> => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character || !character.photo) {
            res.status(404).json({ message: 'Photo not found' });
            return;
        }

        const db = mongoose.connection.db;
        // @ts-ignore
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'characterPhotos' });

        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(character.photo));
        downloadStream.on('error', () => {
            res.status(404).json({ message: 'Photo not found' });
        });
        downloadStream.pipe(res);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving photo', error: err });
    }
};

// Удаление фото
export const deleteCharacterPhoto = async (
    req: TypedRequest<Params>,
    res: Response
): Promise<void> => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character || !character.photo) {
            res.status(404).json({ message: 'Photo not found' });
            return;
        }

        const db = mongoose.connection.db;
        // @ts-ignore
        const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'characterPhotos' });

        // Удаляем фото из GridFS
        await bucket.delete(new mongoose.Types.ObjectId(character.photo));

        // Убираем ID фото из модели персонажа
        character.photo = undefined;
        await character.save();

        res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting photo', error: err });
    }
};
