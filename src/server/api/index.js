import express from 'express';
import UserRoutes from './UserRoutes';
import GroupRoutes from './GroupRoutes';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/group', GroupRoutes);

export default router;
