import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    birthday: {
        type: Date
    },

    parent: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true,
    },

    subjects: {
        type: [{type: String, ref: 'Subject'}],
        required: true,
    },

    teachers: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}],
        required: true,
    },

    information: {
        type: String
    },

    isActive: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Student', StudentSchema);