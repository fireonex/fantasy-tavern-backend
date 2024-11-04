import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { Request, Response, NextFunction } from 'express';
import {authenticateJWT} from "./middlewares/authenticateJWT";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/fantasy_tavern')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

// Корневой маршрут
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Fantasy Tavern API!');
});


// @ts-ignore
app.post('/api/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @ts-ignore
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({ token, userId: user._id });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});



// Защищённый маршрут для получения информации о пользователе

// Защищённый маршрут для получения информации о пользователе
// @ts-ignore
app.get('/api/user', authenticateJWT, (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID not provided' });
    }

    // Найдём пользователя по его ID
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({
                userId: user._id,
                username: user.username,
                email: user.email
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Server error', error: err });
        });
});




// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
