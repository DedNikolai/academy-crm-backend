import express from 'express';
// import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import {Auth, Post} from './validations/validations.js'
import checkAuth from './utils/checkAuth.js';
import checkRole from './utils/ckeckRole.js';
import {UserContoller, PostController} from './controllers/controller.js';
import handleValidationErros from './utils/handleValidationErros.js';
import multer from 'multer';

mongoose.connect(process.env.DB_URL)
    .then(() =>console.log("DB OK"))
    .catch((error) => console.log("DB Error", error))

const app = express();
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads/posts');
    },

    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    // const __dirname = path.resolve();
    // resp.sendFile(path.join(__dirname, 'public/index.html'))
    res.send('Hello World 111')
})


app.post('/auth/register', Auth.registerValidation, handleValidationErros, UserContoller.registeration)
app.post('/auth/login', Auth.loginValidation, UserContoller.login);
app.get('/auth/verify/:id', UserContoller.verifyUser);
app.get('/auth/me', checkAuth, UserContoller.getCurrentUser);
app.post('/auth/forgot-password', Auth.forgotPasswordValidation, UserContoller.forgotPassword);
app.patch('/auth/reset-password/:id', Auth.resetPasswordValidation, UserContoller.resetPassword);
app.post('/posts', checkAuth, checkRole('USER'), Post.createPostValidation, handleValidationErros, PostController.createPost)
app.get('/posts', PostController.getPosts);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, checkRole('USER'), PostController.removePost);
app.patch('/posts/:id', checkAuth, checkRole('USER'), Post.updatePostValidation, PostController.updatePost);
app.post('/posts/upload', checkAuth, checkRole('USER'), upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/posts/${req.file.originalname}`
    });
})


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Server Ok')
})