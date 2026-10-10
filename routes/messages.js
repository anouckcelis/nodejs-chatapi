import express from 'express';
import {
    list,
    show,
    create,
    update,
    destroy
} from '../controllers/api/v1/messages.js';

const router = express.Router();

router.get('/', list);
router.get('/:id', show);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', destroy);

export default router;