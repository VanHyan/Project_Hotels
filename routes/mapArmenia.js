import express from 'express';
import MapArmeniaController from '../controllers/MapArmeniaController';

const router = express.Router();

router.get('/get', MapArmeniaController.get);

export default router;
