const express = require('express');
const router = express.Router();
const { getUserTransactions } = require('../controller/transaction.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, getUserTransactions);

module.exports = router;
