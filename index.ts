import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from './user.model';
import { Request, Response, NextFunction } from 'express';
import { authenticateJWT } from './middlewares/authenticateJWT';

const app = express();
const PORT = process.env.PORT || 5000;
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

// Корневой маршрут
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Fantasy Tavern API!');
});

// @ts-ignore
// Базовая валидация и сообщения об ошибках переведены на английский
app.post('/api/register', async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return res.status(400).json({ message: 'Email field is required' });
    }

    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    if (!username || username.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long and is required' });
    }

    if (username.length > 30) {
        return res.status(400).json({ message: 'Username cannot be longer than 30 characters' });
    }

    if (!password || password.length < 3) {
        return res.status(400).json({ message: 'Password must be at least 3 characters long and is required' });
    }

    if (password.length > 30) {
        return res.status(400).json({ message: 'Password cannot be longer than 30 characters' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'User with this email already exists' });
            } else if (existingUser.username === username) {
                return res.status(400).json({ message: 'User with this username already exists' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User successfully registered' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});


// @ts-ignore
app.post('/api/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

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
// @ts-ignore
app.get('/api/user', authenticateJWT, (req: Request, res: Response) => {
    const userId = (req as any).userId;

    if (!userId) {
        return res.status(400).json({ message: 'User ID не предоставлен' });
    }

    // Найдём пользователя по его ID
    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }
            res.status(200).json({
                userId: user._id,
                username: user.username,
                email: user.email
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Ошибка сервера', error: err });
        });
});

// Запуск сервера
app.listen(5000, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
