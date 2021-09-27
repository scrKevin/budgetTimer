const mongoose = require('mongoose');

const { Schema } = mongoose;

const recurringSchema = new Schema({
  title: String,
  amount: Number,
  startdate: Date,
  ended: Boolean,
  enddate: Date,
  period: Number,
  periodType: String
});

module.exports = mongoose.model('Recurring', recurringSchema);