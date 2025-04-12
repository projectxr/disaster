import express from 'express';
import sirenRoutes from './api/siren';
import districtRoutes from './api/district';

const router = express.Router();

router.use('/api/sirens', sirenRoutes);
router.use('/api/districts', districtRoutes);

export default router;
