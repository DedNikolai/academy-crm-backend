import mongoose from "mongoose";

const StudentSchema = mongoose.Schema({
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

    subjects: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Subject'}]
    },

    teachers: {
        type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Teacher'}]
    }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Student', StudentSchema);