const mongoose = require('mongoose');

const { Schema } = mongoose;

const Transaction = require("./transactionModel")

const budgetSchema = new Schema({
  title: String,
  amount: Number,
  startdate: Date,
  ended: Boolean,
  enddate: Date,
  period: Number,
  periodType: String,
  transactions: [Transaction]
});

module.exports = mongoose.model('Budget', budgetSchema);