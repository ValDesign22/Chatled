import {Schema, model, models} from "mongoose";

export default models.users || model("users", new Schema({
    id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true }
}));