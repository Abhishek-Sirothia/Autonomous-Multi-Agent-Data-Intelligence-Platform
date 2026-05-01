import express from 'express';
// Change 'uploadSalesData' to 'uploadData' here
import { uploadData, getHistory } from '../controllers/dataController';

const router = express.Router();

// Ensure the function names here match the imports above
router.post('/upload', uploadData);
router.get('/history', getHistory); 

export default router;