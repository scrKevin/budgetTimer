const mongoose = require('mongoose');

const { Schema } = mongoose;

const transactionSchema = new Schema({
  title: String,
  amount: Number,
  date: Date,
});

module.exports = mongoose.model('Transaction', transactionSchema);