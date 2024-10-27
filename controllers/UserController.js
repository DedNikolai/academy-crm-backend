import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {validationResult} from 'express-validator';
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import VerifyToken from '../models/VerifyToken.js';
import ResetPasswordToken from '../models/ResetPassWordToken.js';
import sendEmail from '../utils/mailSender.js';
import RoleModel from '../models/Role.js';
import crypto from 'crypto';

export const registeration = async (req, res) => {
    try {
        const {fullName, password, email, avatarUrl, role} = req.body;

        let chekUser = await UserModel.findOne({ email: email });

        if (chekUser) {
            return res.status(400).json({message: "User with given email already exist!"});
        }

        const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);
        const hash = await bcrypt.hash(password, salt);
        const userRole = await RoleModel.findOne({value: role})

        if (!userRole) {
            return res.status(400).json({message: "Invalid user Role"});
        }
    
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
            return res.status(200).json({message: 'Registration success! We sent letter to your email to confirm registration'})
        }
        
    } catch(error) {
        console.log(error)
        res.status(500).json({
            message: 'Registration failed'
        });
    }
};

export const login = async (req, res) => {
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
            _id: user._id,
            roles: user._doc.roles
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
};

export const verifyUser = async (req, res) => {
    const {token} = req.query;
    const {id} = req.params;

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
};

export const getCurrentUser = async (req, res) => {
    try {
       const user = await UserModel.findById(req.userId);

       if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
       }

       const {passwordHash, verified, ...userFromDB} = user._doc;

       res.status(200).json({
           user: userFromDB,
       })

    } catch(error) {
        res.status(500).json({
            message: 'Unauthorized'
        })
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(400).json({message: "Email was not found"})
        }

        let token = await ResetPasswordToken.findOne({ user: user._id });

        if (token) { 
            await token.deleteOne()
        };

        const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);
        const resetToken = crypto.randomBytes(16).toString("hex");
        const hash = await bcrypt.hash(resetToken, salt);
        console.log(user)
        await new ResetPasswordToken({
            user: user._id,
            token: hash,
            createdAt: Date.now(),
          }).save();

          const message = `${process.env.CLIENT_URL}/reset-pass/${user._id}?token=${resetToken}`;
          await sendEmail(user.email, "Reset Password", message);
          return res.status(200).json({message: "To reset pass check ypur email"});


    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Can\'t reset password'
        })
    }
};

export const resetPassword = async (req, res) => {
    try {
        const {password} = req.body;
        const {token} = req.query;
        const {id} = req.params;

        const passwordResetToken = await ResetPasswordToken.findOne({user: id});

        if (!passwordResetToken) {
            throw new Error("Invalid or expired password reset token");
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);

        if (!isValid) {
            throw new Error("Invalid or expired password reset token");
        }

        const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);
        const passHash = await bcrypt.hash(password, salt);

        UserModel.findOneAndUpdate({_id: id}, {passwordHash: passHash}, {returnDocument: 'after'})
        .then(response => {
            if (!response) {
                return res.status(400).json({message: `Password was not updated`})
            }
            passwordResetToken.deleteOne();
            return res.status(400).json({message: "Password was updated"});
        }) ;

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Can\'t update password'
        })
    }
}