import express from 'express';
import UserRoutes from './UserRoutes';
import GroupRoutes from './GroupRoutes';
import AdminRoutes from './AdminRoutes';

const router = express.Router();

router.use('/user', UserRoutes);
router.use('/group', GroupRoutes);
router.use('/admin', AdminRoutes);

export default router;
