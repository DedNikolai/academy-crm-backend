import mongoose from "mongoose";

const RoleSchema = mongoose.Schema({
    value: {
        type: String,
        required: true,
        default: 'USER'
    }
});

export default mongoose.model('Role', RoleSchema);