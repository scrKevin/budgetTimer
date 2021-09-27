const mongoose = require('mongoose');

const { Schema } = mongoose;

const Recurring = require("./recurringModel")
const Budget = require("./budgetModel")
const Transaction = require("./transactionModel")

const accountSchema = new Schema({
  name: String,
  startbalance: Number,
  recurring: [Recurring],
  budgets: [Budget],
  transactions: [Transaction]
});

module.exports = mongoose.model('Account', accountSchema);