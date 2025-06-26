const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: Number,
  date: Date,
  status: String,
});

module.exports = mongoose.model('Transaction', transactionSchema);
