const mongoose = require('mongoose');

const { Schema } = mongoose;

const Transaction = require("./transactionModel").schema

const budgetSchema = new Schema({
  title: String,
  amount: Number,
  startdate: Date,
  ended: Boolean,
  enddate: Date,
  period: Number,
  periodType: String,
  transactions: [Transaction],
  settlements: [Transaction]
});

module.exports = mongoose.model('Budget', budgetSchema);