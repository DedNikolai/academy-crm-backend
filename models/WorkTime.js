import mongoose from "mongoose";

const WorkTimeSchema = mongoose.Schema({
    day: {
        type: String,
        required: true,
    },

    startTime: {
        type: Date,
        required: true
    },

    endTime: {
        type: Date,
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    },

    {
        timestamps: true
    }
);

export default mongoose.model('WorkTime', WorkTimeSchema);