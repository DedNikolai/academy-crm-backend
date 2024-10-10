import express from 'express';
// import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import {Auth} from './validations/validations.js'
import checkAuth from './utils/checkAuth.js';
import {UserContoller} from './controllers/controller.js';
import handleValidationErros from './utils/handleValidationErros.js';

mongoose.connect(process.env.DB_URL)
    .then(() =>console.log("DB OK"))
    .catch((error) => console.log("DB Error", error))

const app = express();
app.use(express.json())
const port = process.env.PORT || 8000

app.get("/", (req, res) => {
    // const __dirname = path.resolve();
    // resp.sendFile(path.join(__dirname, 'public/index.html'))
    res.send('Hello World 111')
})


app.post('/auth/register', Auth.registerValidation, handleValidationErros, UserContoller.registeration)
app.post('/auth/login', UserContoller.login);
app.get('/auth/verify/:id', UserContoller.verifyUser);
app.get('/auth/me', checkAuth, UserContoller.getCurrentUser);
app.post('/auth/forgot-password', Auth.forgotPasswordValidation, UserContoller.forgotPassword);
app.patch('/auth/reset-password/:id', Auth.resetPasswordValidation, UserContoller.resetPassword);


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Server Ok')
})