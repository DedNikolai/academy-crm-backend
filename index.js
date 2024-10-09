import express from 'express';
// import path from 'path';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js'
import {validationResult} from 'express-validator';
import UserModel from './models/User.js';
import bcrypt from 'bcrypt';
import VerifyToken from './models/VerifyToken.js';
import sendEmail from './utils/mailSender.js';
import RoleModel from './models/Role.js';
import crypto from 'crypto';

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


app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const {fullName, password, email, avatarUrl} = req.body;
        const erros = validationResult(req);

        if(!erros.isEmpty()) {
            return res.status(400).json(erros.array())
        }

        let chekUser = await UserModel.findOne({ email: email });

        if (chekUser) {
            return res.status(400).json({message: "User with given email already exist!"});
        }

        const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);
        const hash = await bcrypt.hash(password, salt);
        const userRole = await RoleModel.findOne({value: 'USER'})
    
        const doc = new UserModel({
             email,
             fullName,
             avatarUrl,
             passwordHash: hash,
             roles: [userRole.value],
        })
        
        const user = await doc.save()

        if (user) {
            let token = await VerifyToken.create({
                user: user._id,
                token: crypto.randomBytes(16).toString("hex")
            });

            const message = `${process.env.CLIENT_URL}/auth/verify/${user._id}?token=${token.token}`;
            await sendEmail(user.email, "Verify Email", message);
            return res.status(200).json({message: 'Registration success! We sent letter to your email to confir registration'})
        }
        
    } catch(error) {
        console.log(error)
        res.status(500).json({
            message: 'Registration failed'
        });
    }
})

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email})

        if (!user || !user.verified) {
            return res.status(404).json({
                message: 'Invalid login or password'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return req.status(404).json({
                message: 'Invalid login or password'
            })
        }

        const token = jwt.sign({
            _id: user._id
        }, process.env.SECRET_KEY,{expiresIn: '30d'});

        const {passwordHash, ...userFromDB} = user._doc;

        res.status(200).json({
            user: userFromDB,
            token
        })

    } catch(error) {
            console.log(error)
            res.status(403).json({
            message: 'Authorization failed'
        });
    }
});

app.get('/auth/verify/:id', async (req, res) => {
    const {token} = req.query;
    const {id} = req.params;
    console.log(token)
    try {
        const verifyToken = await VerifyToken.findOne({user: id, token})

        if (!verifyToken) {
            return res.status(400).json({message: "Email was not confirmed"})
        }

        UserModel.findOneAndUpdate({_id: id}, {verified: true}, {returnDocument: 'after'})
            .then(response => {
                if (!response) {
                    return res.status(400).json({message: `User ${id} not found`})
                }
                verifyToken.deleteOne();
                return res.status(200).json({message: "Email was confirmed"});
        }) 

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Can\'t confirm email'
        })
    }
})

app.get('/auth/me', (req, res) => {
    try {

    } catch(error) {

    }
})

app.listen(port, (err) => {
    if (err) {
        console.log(err)
    }

    console.log('Server Ok')
})