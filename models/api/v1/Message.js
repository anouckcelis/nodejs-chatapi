import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        sparse: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    },
    user: {
        type: String,
        required: true
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;