import express from 'express';
import HotelsController from '../controllers/HotelsController';

const router = express.Router();

router.post('/create', HotelsController.create);
router.put('/update', HotelsController.update);
router.delete('/delete/:hotelId', HotelsController.delete);
router.get('/getAll', HotelsController.getHotels);
router.get('/getHotels', HotelsController.getHotelsUnLogin);
router.get('/getFoolHotel', HotelsController.getHotelsFoll);

export default router;
