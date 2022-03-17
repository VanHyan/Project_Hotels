import express from 'express';
import imageUploader from '../middlewares/imageUploader';
import RoomsController from '../controllers/RoomsController';

const router = express.Router();

router.post('/create', imageUploader.array('files'), RoomsController.create);
router.put('/update', imageUploader.array('files'), RoomsController.update);
router.delete('/delete/:roomId', RoomsController.deleteRoom);

export default router;
