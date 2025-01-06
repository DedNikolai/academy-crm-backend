import mongoose from "mongoose";

const PayAccountSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    value: {
        type: Number,
        required: true,
        default: 0
    },

    },

    {
        timestamps: true
    }
);

export default mongoose.model('PayAccount', PayAccountSchema);