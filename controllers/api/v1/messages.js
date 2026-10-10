import mongoose from 'mongoose';
import Message from '../../../models/api/v1/Message.js';
import Counter from '../../../models/api/v1/Counter.js';

// Zoek een bericht op basis van het numerieke ID of MongoDB _id
const findMessageByRouteId = async (id) => {
    if (/^\d+$/.test(id)) {
        return Message.findOne({ id: Number(id) });
    }

    if (mongoose.isValidObjectId(id)) {
        return Message.findById(id);
    }

    return null;
};

// GET: alle berichten
export const list = async (req, res, next) => {
    try {
        const { user } = req.query;

        const messages = user
            ? await Message.find({ user })
            : await Message.find({});

        res.json({
            status: 'success',
            message: 'GETTING messages',
            data: { messages }
        });
    } catch (err) {
        next(err);
    }
};

// GET: één bericht op basis van id of _id
export const show = async (req, res, next) => {
    try {
        const message = await findMessageByRouteId(req.params.id);

        if (!message) {
            return res.status(404).json({
                status: 'fail',
                message: `Message ${req.params.id} not found`,
                data: { id: req.params.id }
            });
        }

        res.json({
            status: 'success',
            message: `GETTING message ${req.params.id}`,
            data: { message }
        });
    } catch (err) {
        next(err);
    }
};

// POST: een nieuw bericht aanmaken
export const create = async (req, res, next) => {
    try {
        const newData = req.body.message;

        if (
            !newData ||
            typeof newData.user !== 'string' ||
            !newData.user.trim() ||
            typeof newData.text !== 'string' ||
            !newData.text.trim()
        ) {
            return res.status(400).json({
                status: 'fail',
                message: 'User and text are required',
                data: { message: null }
            });
        }

        const counter = await Counter.findOneAndUpdate(
            { _id: 'messageId' },
            { $inc: { sequence_value: 1 } },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        const message = new Message({
            id: counter.sequence_value,
            user: newData.user.trim(),
            text: newData.text.trim()
        });

        await message.save();

        res.status(201).json({
            status: 'success',
            message: 'Message saved',
            data: { message }
        });
    } catch (err) {
        next(err);
    }
};

// PUT: een bestaand bericht aanpassen
export const update = async (req, res, next) => {
    try {
        const changes = req.body.message;

        if (!changes || typeof changes !== 'object') {
            return res.status(400).json({
                status: 'fail',
                message: 'Message is required',
                data: { message: null }
            });
        }

        const message = await findMessageByRouteId(req.params.id);

        if (!message) {
            return res.status(404).json({
                status: 'fail',
                message: `Message ${req.params.id} not found`,
                data: { id: req.params.id }
            });
        }

        if (changes.user !== undefined) {
            if (typeof changes.user !== 'string' || !changes.user.trim()) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'User must be a non-empty string',
                    data: { message: null }
                });
            }

            message.user = changes.user.trim();
        }

        if (changes.text !== undefined) {
            if (typeof changes.text !== 'string' || !changes.text.trim()) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Text must be a non-empty string',
                    data: { message: null }
                });
            }

            message.text = changes.text.trim();
        }

        await message.save();

        res.json({
            status: 'success',
            message: 'Message updated',
            data: { message }
        });
    } catch (err) {
        next(err);
    }
};

// DELETE: een bericht verwijderen
export const destroy = async (req, res, next) => {
    try {
        const message = await findMessageByRouteId(req.params.id);

        if (!message) {
            return res.status(404).json({
                status: 'fail',
                message: `Message ${req.params.id} not found`,
                data: { id: req.params.id }
            });
        }

        await message.deleteOne();

        res.json({
            status: 'success',
            message: 'Message deleted'
        });
    } catch (err) {
        next(err);
    }
};