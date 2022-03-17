import express from 'express';
import BookingController from '../controllers/BookingController';

const router = express.Router();

router.post('/create', BookingController.create);
router.put('/update', BookingController.update);
// router.delete('/delete/:roomId', RoomsController.deleteRoom);

export default router;
