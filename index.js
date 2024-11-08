import express from 'express';
// import path from 'path';
import 'dotenv/config';
import mongoose from 'mongoose';
import {Auth, Role} from './validations/validations.js'
import checkAuth from './utils/checkAuth.js';
import checkRole from './utils/ckeckRole.js';
import {UserContoller, RoleController} from './controllers/controller.js';
import handleValidationErros from './utils/handleValidationErros.js';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';

mongoose.connect(process.env.DB_URL)
    .then(() =>console.log("DB OK"))
    .catch((error) => console.log("DB Error", error))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        try {
        if (!fs.existsSync('uploads/posts')) {
            fs.mkdirSync('uploads/posts', {recursive: true});
          }
      } catch (error) {
        console.error(error)
      }
        cb(null, 'uploads/posts');
    },

    filename: (req, file, cb) => {
        const savedFileName = Date.now() + '-' + file.originalname;
        req.fileName = savedFileName; 
        cb(null, savedFileName);
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 8000;

app.get("/", (req, res) => {
    // const __dirname = path.resolve();
    // resp.sendFile(path.join(__dirname, 'public/index.html'))
    res.send('Hello World 111')
})


app.post('/auth/register', checkAuth, checkRole(['OWNER']), Auth.registerValidation, handleValidationErros, UserContoller.registeration)
app.post('/auth/login', Auth.loginValidation, handleValidationErros, UserContoller.login);
app.get('/auth/verify/:id', UserContoller.verifyUser);
app.get('/auth/me', checkAuth, UserContoller.getCurrentUser);
app.post('/auth/forgot-password', Auth.forgotPasswordValidation, handleValidationErros, UserContoller.forgotPassword);
app.patch('/auth/reset-password/:id', Auth.resetPasswordValidation, handleValidationErros, UserContoller.resetPassword);
app.patch('/auth/update/:id', checkAuth, checkRole(['OWNER']), Auth.updateValidation, handleValidationErros, UserContoller.updateUser);

// app.post('/roles', checkAuth, checkRole(['OWNER']), Role.createRoleValidation, RoleController.createRole)

// app.post('/posts', checkAuth, checkRole('USER'), Post.createPostValidation, handleValidationErros, PostController.createPost);

app.post('/upload', checkAuth, checkRole(['OWNER, ADMIN']), upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.fileName}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        message: 'Upload Failed'
        })
    }
});
app.delete('/file/remove', checkAuth, checkRole('USER'), async (req, res) => {
    try {
        const path = req.query.path;
        const filePath = process.env.DIRNAME + path;

        fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error(err);
              return res.status(400).json({message: 'Cant remove file'});
            }
            if (!stats.isFile()) {
                return res.status(400).json({message: 'No such file'});
            }
          });

        await fs.unlink(filePath, err => {
            if (err) {
                console.log(err)
                return res.status(400).json({message: 'error in deleting a file from uploads'})
            } else {
                return res.status(200).json({message: 'succesfully deleted from the uploads folder'})
            }
        })
    } catch(error) {
        console.log(error);
        return res.status(500).json(error)
    }
})


app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }
    console.log('Start Server Ok')
})