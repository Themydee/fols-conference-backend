import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { DB } from './db/config.js'
import userRoute from './route/register.route.js'
import adminRoute from './route/admin.route.js'


dotenv.config()

const app = express();
const PORT = process.env.PORT || 3300

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send('Hello world!')
})

app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)

app.listen(PORT, () => {
    DB();
    console.log("Server is running successfully")
})