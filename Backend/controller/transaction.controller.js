const Transaction = require('../models/transaction.model');

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = { getUserTransactions };
