import mongoose from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";

const SalarySchema = mongoose.Schema({

    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
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

SalarySchema.plugin(mongoosePaginate)

export default mongoose.model('Salary', SalarySchema);