import mongoose from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";

const LessonSchema = mongoose.Schema({
    day: {
        type: String,
        required: true,
    },

    date: {
        type: Date,
        required: true
    },

    // time: {
    //     type: Date,
    //     required: true
    // },

    durationMinutes: {
        type: Number,
        required: true
    },

    room: {
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
    },

    status: {
        type: String,
        default: ''
    },

    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    }

    },

    {
        timestamps: true
    }
);

LessonSchema.plugin(mongoosePaginate)

export default mongoose.model('Lesson', LessonSchema);