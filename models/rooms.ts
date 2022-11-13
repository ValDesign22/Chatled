import {Schema, model, models} from "mongoose";

export default models.rooms || model("rooms", new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    owner: { type: String, required: true },
    users: { type: [String], required: false },
    messages: { type: [String], required: false }
}));