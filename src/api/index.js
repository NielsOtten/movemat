import express from 'express';
import UserRoutes from './UserRoutes';

const router = express.Router();

router.use('/user', UserRoutes);

export default router;
