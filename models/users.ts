import {Schema, model, models} from "mongoose";

export default models.users || model("users", new Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    confirmed: {
        type: String, 
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmCode: { type: String, required: true }
}));