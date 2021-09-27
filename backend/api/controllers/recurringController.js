const mongoose = require('mongoose');
const recurring = mongoose.model('Recurring');

exports.list_all_recurring = (req, res) => {
  console.log("req. list all recurring")
  recurring.find({}, (err, recurringList) => {
    if (err) res.send(err);
    res.json(recurringList);
  });
};

exports.create_a_recurring = (req, res) => {
  const newRecurring = new recurring(req.body);
  newRecurring.save((err, recurring) => {
    if (err) res.send(err);
    res.json(recurring);
  });
};

exports.read_a_recurring = (req, res) => {
  recurring.findById(req.params.recurringId, (err, recurring) => {
    if (err) res.send(err);
    res.json(recurring);
  });
};

exports.update_a_recurring = (req, res) => {
  recurring.findOneAndUpdate(
    { _id: req.params.recurringId },
    req.body,
    { new: true },
    (err, recurring) => {
      if (err) res.send(err);
      res.json(recurring);
    }
  );
};

exports.delete_a_recurring = (req, res) => {
  recurring.deleteOne({ _id: req.params.recurringId }, err => {
    if (err) res.send(err);
    res.json({
      message: 'recurring successfully deleted',
     _id: req.params.recurringId
    });
  });
};