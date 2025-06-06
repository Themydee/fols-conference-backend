import { Admin } from "../models/admin.models.js";
import { User } from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' })
        }

        const adminExists = await Admin.findOne({ email })
        if (adminExists) {
            return res.status(400).json({ message: 'Admin with this email already exists.' })
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt)

        const newAdmin = new Admin({
            name,
            email,
            password: encryptedPassword,
        })

        await newAdmin.save()
        res.status(201).json({ message: 'Admin created successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error. Please try again later' })
    }
}

export const loginAdmin = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(401).json({ message: 'Invalid email ' })
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid  password.' });
        }
        const token = jwt.sign(
            { id: admin._id, email: admin.email, username: admin.username },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}