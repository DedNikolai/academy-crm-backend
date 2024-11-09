import mongoose from "mongoose";

const ResetEmailSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },

    email: {
        type: String,
        request: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 24*3600
   },
    });

    export default mongoose.model('ResetEmail', ResetEmailSchema);