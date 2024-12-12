import mongoose from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";

const TicketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    subject: {
        type: String, 
    },

    generalAmount: {
        type: Number,
        required: true,
    },

    lessons: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
        default: []
    },

    // usedAmount: {
    //     type: Number,
    //     required: true,
    // },

    // transferred: {
    //     type: Number,
    //     required: true,
    // }

    },
    {
        timestamps: true
    }
);

TicketSchema.plugin(mongoosePaginate)

export default mongoose.model('Ticket', TicketSchema);