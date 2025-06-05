import { User } from '../models/user.models.js'


export const register = async (req, res) => {
    try {
        const { name, email, age, phone, gender, parish, area, designation } = req.body;

        if (!name || !email || !age || !phone || !gender || !parish || !area || !designation) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        const userIsRegistered = await User.findOne({ email });
        if (userIsRegistered) {
            return res.status(400).json({ message: 'Email is already registered' })
        }

        const newUser = new User({
            name,
            email,
            age,
            phone,
            gender,
            parish,
            area,
            designation
        })

        await newUser.save();

        res.status(201).json({
            message: 'Registration successful!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                age: newUser.age,
                phone: newUser.phone,
                gender: newUser.gender,
                parish: newUser.parish,
                area: newUser.area,
                designation: newUser.designation,
                checkedIn: newUser.checkedIn,
                registeredAt: newUser.registeredAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}