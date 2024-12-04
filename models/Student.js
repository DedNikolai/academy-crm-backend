import mongoose from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";

const StudentSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    birthday: {
        type: Date
    },

    parents: {
        type: String,
    },

    email: {
        type: String,
        required: true,
        // unique: true
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
        type: Boolean,
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

StudentSchema.plugin(mongoosePaginate)

export default mongoose.model('Student', StudentSchema);