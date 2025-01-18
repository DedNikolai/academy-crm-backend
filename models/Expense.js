import mongoose from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";

const ExpenseSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    value: {
        type: Number,
        required: true
    },

    payaccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayAccount',
        required: true
    }

    },
    {
        timestamps: true
    }
);

ExpenseSchema.plugin(mongoosePaginate)

export default mongoose.model('Expense', ExpenseSchema);