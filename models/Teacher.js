import mongoose from "mongoose";

const TeacherSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
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

    worktimes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkTime' }],
        default: []
    },

    subjects: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}],
        default: []
    },

    // students: {
    //     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    //     default: []
    // },

    age: {
        type: Number,
    },

    birthday: {
        type: Date
    },

    education: {
        type: String
    }

    },

    {
        timestamps: true
    }
);

export default mongoose.model('Teacher', TeacherSchema);