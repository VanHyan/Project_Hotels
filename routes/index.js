import express from 'express';
import users from './users';
import photos from './photos';
import hotels from './hotels';
import rooms from './rooms';
import booking from './booking';
import mapArmenia from './mapArmenia';

const router = express.Router();

router.use('/users', users);
router.use('/photos', photos);
router.use('/hotels', hotels);
router.use('/rooms', rooms);
router.use('/booking', booking);
router.use('/map', mapArmenia);

export default router;
