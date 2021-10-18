const mongoose = require('mongoose');

const { Schema } = mongoose;

const Recurring = require("./recurringModel").schema
const Budget = require("./budgetModel").schema
const Transaction = require("./transactionModel").schema

const accountSchema = new Schema({
  name: { type: String, required: true },
  startdate: Date,
  startbalance: { type: Number, required: true },
  recurring: [Recurring],
  budgets: [Budget],
  transactions: [Transaction],
  reservations: [Transaction]
});

module.exports = mongoose.model('Account', accountSchema);