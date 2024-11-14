import express from 'express';
// import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import auth from './routes/auth.js';
 
mongoose.connect(process.env.DB_URL)
    .then(() =>console.log("DB OK"))
    .catch((error) => console.log("DB Error", error))

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    // const __dirname = path.resolve();
    // resp.sendFile(path.join(__dirname, 'public/index.html'))
    res.send('Hello CRM')
})

app.use('/auth', auth);


// app.post('/roles', checkAuth, checkRole(['OWNER']), Role.createRoleValidation, RoleController.createRole)


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Start Server Ok')
})