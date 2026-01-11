import mongoose from 'mongoose';
import User from '../models/useModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';

const TOKEN_EXPIRES_IN = '24h';

//Register
export async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            })
        }
        if(!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address.'
            })
        }

        const exists = await User.findOne({ email }).lean();
        if(exists) {
            return res.status(409).json({
                success: false,
                message: 'User already exists.'
            })
        }
        const newId = new mongoose.Types.ObjectId();
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            id: newId,
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        const token = jwt.sign({id: newId.toString()}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES_IN});

        return res.status(201).json({
            success: true,
            message: 'User created successfully.',
            token,
            user: {id: user._id.toString(), name: user.name, email: user.email}
        });
    } catch (error) {
        console.error('Register Error: ', error);
        return  res.status(500).json({
            success: false,
            message: 'Internal server error.'});
    }
}

//login

export async function login(req, res) {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            })
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.'
            })
        }

        const token = jwt.sign({id: user._id.toString()}, JWT_SECRET, {expiresIn: TOKEN_EXPIRES_IN});

        return res.status(201).json({
            success: true,
            message: 'Login successfully.',
            token,
            user: {id: user._id.toString(), name: user.name, email: user.email}
        });
    } catch (error) {
        console.error('Login Error: ', error);
        return  res.status(500).json({
            success: false,
            message: 'Internal server error.'});
    }
}