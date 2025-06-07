import { User } from '../models/user.models.js'
import transporter from '../mailer/mailsend.config.js';

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

        const code = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            name,
            email,
            age,
            phone,
            gender,
            parish,
            area,
            designation,
            code
        })

        await newUser.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Your Conference Code", // <-- fixed here
            text: `Your conference code is ${code}`,
        }


       console.log("About to send email...");
        await transporter.sendMail(mailOptions);
        transporter.close(); // <-- force close transporter if it hangs
        console.log("Email sent, about to respond...");
        return res.status(201).json({
            message: 'Registration successful! Your conference code has been sent to your email',
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
                registeredAt: newUser.registeredAt,
                code: newUser.code
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Please try again later.' })
    }
}