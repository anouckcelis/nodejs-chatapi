import mongoose from 'mongoose';
const { Schema } = mongoose;
const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    }
});
const Message = mongoose.model('Message', messageSchema);
export default Message;