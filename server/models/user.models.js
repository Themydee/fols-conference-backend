import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        min: 0,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    parish: {
        type: String,
        required: true,
    },
    area: {
        type: String,
        required: true,
    },
    designation: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        sparse: true,
    },
    checkedIn: {
        type: Boolean,
        default: false,
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model('User', userSchema);