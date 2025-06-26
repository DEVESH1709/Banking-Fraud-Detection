import mongoose from 'mongoose';

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

const Transaction = mongoose.model('Transaction',transactionSchema );
 
export default Transaction;

