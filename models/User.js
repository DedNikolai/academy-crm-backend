import { timeStamp } from "console";
import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    avatarUrl: String,

    verified: {
        type: Boolean,
        default: false,
    },

    roles: [{type: String, ref: 'Role'}]
},
{
    timestamps: true
}
);

export default mongoose.model('User', UserSchema);