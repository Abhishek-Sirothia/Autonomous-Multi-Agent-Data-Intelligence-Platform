import express from 'express';
import { uploadSalesData } from '../controllers/dataController';

const router = express.Router();

// This defines the endpoint: POST http://localhost:5000/api/data/upload
router.post('/upload', uploadSalesData);

export default router;