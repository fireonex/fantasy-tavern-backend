import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Регистрация пользователя
export async function registerUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, email, password } = req.body;

        // Валидация входных данных
        if (!email || !username || !password) {
            res.status(400).json({ message: 'Please provide all required fields.' });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists with this email.' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, 'secret_key', { expiresIn: '1h' });

        res.status(201).json({ userId: newUser._id, token, username: newUser.username });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// Авторизация пользователя
export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Please provide both email and password.' });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials.' });
            return;
        }

        const token = jwt.sign({ userId: user._id }, 'secret_key', { expiresIn: '1h' });

        res.status(200).json({ userId: user._id, token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}

// Получение информации о пользователе
export async function getUser(req: Request, res: Response): Promise<void> {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        res.status(200).json({ userId: user._id, username: user.username, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err });
    }
}
