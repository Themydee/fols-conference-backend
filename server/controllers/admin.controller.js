import { Admin } from "../models/admin.models.js";
import { User } from '../models/user.models.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const adminExists = await Admin.findOne({ email })
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin with this email already exists.' })
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(password, salt)

        const newAdmin = new Admin({
            name,
            email,
            password: encryptedPassword,
        })

        await newAdmin.save()
        res.status(201).json({ success: true, message: 'Admin created successfully' })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success:false, message: 'Server error. Please try again later' })
    }
}

export const loginAdmin = async (req, res) => {

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success:false, message: 'Email and password are required.' });
        }

        const admin = await Admin.findOne({ email })
        if (!admin) {
            return res.status(401).json({ success:false, message: 'Invalid email ' })
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success:false, message: 'Invalid  password.' });
        }
        const token = jwt.sign(
            { id: admin._id, email: admin.email, username: admin.username },
            JWT_SECRET_KEY,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            success: true,
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

export const verifyUserCode = async(req, res) => {
    try{
        const {email, code} = req.body;

        if(!email || !code){
            return res.status(400).json({ success: false, message: 'Email and code are required'})
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message: 'User not found or does not exist'})
        }

        if(user.code !== code){
            return res.status(400).json({success: false, message: 'The code provided is incorrect'})
        }

        user.checkedIn = true;
        await user.save();

        return res.status(200).json({ success: true, message: 'User code verified successfully. Welcome to The way Conference.'})
    }catch(error){  
        console.error(error)
        return res.status(500).json({ success: false, message: 'Server error. Please try again later.' })
    }
}
