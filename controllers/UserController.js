import jwt from 'jsonwebtoken';
import 'dotenv/config';
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';
import VerifyToken from '../models/VerifyToken.js';
import ResetPasswordToken from '../models/ResetPassWordToken.js';
import sendEmail from '../utils/mailSender.js';
import RoleModel from '../models/Role.js';
import ResetEmailModel from '../models/ResetEmail.js';
import crypto from 'crypto';

export const registeration = async (req, res) => {
    try {
        const {fullName, password, email, avatarUrl, roles} = req.body;

        let chekUser = await UserModel.findOne({ email: email });

        if (chekUser) {
            return res.status(400).json({message: "User with given email already exist!"});
        }

        const salt = await bcrypt.genSalt(+process.env.BCRYPT_SALT);
        const hash = await bcrypt.hash(password, salt);
        const userRole = await RoleModel.findOne({value: roles[0]})

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
            return res.status(200).json(user)
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
            return res.status(404).json({
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
            return res.status(200).json({message: "Password was updated"});
        }) ;

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Can\'t update password'
        })
    }
}

export const resetEmail = async (request, response) => {
    try {
        const id = request.userId;
        const email = request.body.email;
        const code = Math.ceil(Math.random() * (9999 - 1000) + 1000);

        const user = await UserModel.findById(id);

        let reset = await ResetEmailModel.findOne({ user: user._id });

        if (reset) { 
            await reset.deleteOne()
        };

        await new ResetEmailModel({
            user: user._id,
            code: code.toString(),
            email: email
          }).save();

          const message = `Code: ${code}`;
          await sendEmail(email, "Reset Email", message);
          return response.status(200).json({message: "Use code to confirm changes from email"});


    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t update email'
        })
    }
}

export const updateEmail = async (request, response) => {
    try {
        const id = request.userId;
        const code = request.body.code;

        const reset = await ResetEmailModel.findOne({user: id, code});

        if (!reset) {
            return response.status(400).json("Email was not updated")
        }

         UserModel.findOneAndUpdate({_id: id}, {email: reset.email}, {returnDocument: 'after'})
            .then(res => {
                if (!res) {
                    return response.status(400).json({message: `Email was not updated`})
                }
                reset.deleteOne();
                return response.status(200).json(res);
            })

    } catch(error) {
        console.log(error);
        response.status(500).json({
            message: 'Can\'t update email'
        })
 }

}

export const updateUser = async (request, response) => {
    try {
        const id = request.params.id;
        const user = request.body;
        const doc = UserModel.findById(id);
        
        if (!doc) {
            return response.status(400).json("No such user for update");
        }

        UserModel.findOneAndUpdate({_id: id}, {...user}, {returnDocument: 'after'}).then(res => {
            if (!res) {
                return response.status(400).json("User was not  updated");
            }

            return response.status(200).json(res)
        })        

    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: 'Can\'t update user'
        })
    }
};

export const getUsers = async (request, response) => {
    try {
        const {role} = request.query;

        const userRole = await RoleModel.findOne({value: role})

        if (!userRole) {
            return response.status(400).json({message: "Invalid user Role"});
        }

        const users = await UserModel.find({roles: role})

        if (users) {
            return response.status(200).json(users)
        }

    } catch(error) {
        console.log(error);
        response.status(500).json('Can\'t get users')
    }
}

export const getUserById = async (requst, response) => {
    try {
        const id = requst.params.id;

        const user = await UserModel.findById(id);

        if (!user) {
            return response.status(400).json({message: 'user not found'});
        }

        return response.status(200).json(user);

    } catch(error) {
        console.log(error);
        response.status(500).json('Can\'t get users')
    }
}

export const deleteUser = async (request, response) => {
    try {
        const id = request.params.id;

        const user = await UserModel.findById(id);

        if (!user) {
            return response.status(400).json('User with such id not found');
        }

        UserModel.deleteOne({_id: id}).then(res => {
            if (res) {
                return response.status(200).json({message: 'User was deletad'})
            } else {
                return response.status(400).json('User was not deleted');
            }
        })

    } catch(error) {
        console.log(error);
        response.status(500).json({message: ' Cant delete user'})
    }
}