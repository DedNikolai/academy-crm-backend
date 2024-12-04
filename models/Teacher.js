import mongoose from "mongoose";

const TeacherSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        // unique: true
    },

    worktimes: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkTime' }],
        default: []
    },

    subjects: {
        type: [{type: String, ref: 'Subject'}],
        default: []
    },

    // students: {
    //     type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    //     default: []
    // },

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