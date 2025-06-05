import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        required: true,
        sparse: true
    },
    checkedIn: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now()
    }
});

export const User = mongoose.model('User', userSchema)