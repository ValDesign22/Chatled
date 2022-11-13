import {Schema, model, models} from "mongoose";

export default models.rooms || model("rooms", new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
    owner: { type: String, required: true },
    users: { type: [String], required: false },
    messages: {
        type: [{
            id: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, required: true },
            updatedAt: { type: Date, required: true },
            user: { type: {
                id: { type: String, required: true },
                username: { type: String, required: true },
                createdAt: { type: Date, required: true },
                updatedAt: { type: Date, required: true },
            }, required: true },
            room: { type: String, required: true }
        }],
        required: false
    }
}));