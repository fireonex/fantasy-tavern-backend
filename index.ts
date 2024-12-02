import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import characterRoutes from './routes/character.routes';
import userRoutes from './routes/user.routes';
import dialogueRoutes from "./routes/dialogue.routes";

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/fantasy_tavern')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Основные маршруты
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api', dialogueRoutes);

// Запуск сервера
app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
