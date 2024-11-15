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
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkTime' }]
    },

    subjects: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}]
    }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Teacher', TeacherSchema);