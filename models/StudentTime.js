import mongoose from "mongoose";

const StudentTimeSchema = mongoose.Schema({
    day: {
        type: String,
        required: true,
    },

    startTime: {
        type: Date,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    sortOrder: {
        type: Number,
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    subject: {
        type: String, 
        required: true
    },

    room: {
        type: Number
    }

    },

    {
        timestamps: true
    }
);

export default mongoose.model('StudentTime', StudentTimeSchema);