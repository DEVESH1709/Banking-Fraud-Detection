import express from 'express';
import { getUserTransactions } from '../controller/transaction.controller.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/', verifyToken, getUserTransactions);

export default router;
