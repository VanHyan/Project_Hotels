import express from 'express';
import PhotosController from '../controllers/PhotosController';
import imageUploader from '../middlewares/imageUploader';

const router = express.Router();

router.post('/upload', imageUploader.single('file'), PhotosController.upload);
router.delete('/delete', PhotosController.deletePhoto);

export default router;
