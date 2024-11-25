import mongoose from "mongoose";

const SubjectSchema = mongoose.Schema({
    value: {
        type: String,
        required: true,
    }
});

export default mongoose.model('Subject', SubjectSchema);