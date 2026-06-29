import { Router } from 'express';
import { trainModel, predictRisk, retrainModel, metrics, health } from '../controllers/ml';

const router = Router();

router.post('/train', trainModel);
router.post('/predict', predictRisk);
router.post('/retrain', retrainModel);
router.get('/metrics', metrics);
router.get('/health', health);

export default router;
