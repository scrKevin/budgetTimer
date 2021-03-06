const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const recurringModel = mongoose.model('Recurring');
const transactionModel = mongoose.model('Transaction');

exports.addRecurring = async (req, res) => {
  newRecurring = new recurringModel(req.body)
  //console.log(req.params)
  userModel.updateOne(
    {
      _id: req.userData._id,
      "accounts._id": req.params.accountId
    },
    {
      $push: {
        "accounts.$.recurring": newRecurring
      }
    },
    { new: true },
    (err, user) => {
      if (err) res.send(err);
      res.json({
        message: 'recurring successfully added',
        addedRecurring: newRecurring
      });
    }
  )
}

exports.removeRecurring = async (req, res) => {
  userModel.updateOne(
    {
      _id: req.userData._id,
      "accounts._id": req.params.accountId,
    },
    {
      $pull: {
        "accounts.$.recurring": { _id: req.params.recurringId }
      }
    },
    (err, user) => {
      if (err) res.send(err);
      res.json({
        message: 'recurring successfully deleted',
        deletedRecurringId: req.params.recurringId
      });
    }
  )
}

exports.updateRecurring = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)
  recurring["title"] = req.body.title
  recurring["amount"] = req.body.amount
  recurring["startdate"] = req.body.startdate
  recurring["ended"] = req.body.ended
  recurring["enddate"] = req.body.enddate
  recurring["period"] = req.body.period
  recurring["periodType"] = req.body.periodType

  await doc.save()
  res.json({
    message: 'recurring successfully edited',
    editedRecurringId: recurring._id
  });
}

exports.addTransaction = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)

  var newTransaction = new transactionModel(req.body)
  recurring.transactions.push(newTransaction);

  await doc.save()
  res.json({
    message: 'transaction successfully added',
    addedTransaction: newTransaction
  });
}

exports.removeTransaction = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)

  recurring.transactions = recurring.transactions.filter((transaction) => {
    return req.params.transactionId != transaction._id
  })

  await doc.save()

  //console.log(req.params)
  res.json({
    message: 'transaction successfully removed',
    removedTransactionId: req.params.transactionId
  });
}

exports.editTransaction = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)
  var transaction = recurring.transactions.id(req.params.transactionId)

  transaction['title'] = req.body.title
  transaction['amount'] = req.body.amount
  transaction['date'] = req.body.date

  await doc.save()

  //console.log(req.params)
  //console.log(req.body)
  res.json({
    message: 'transaction successfully edited',
    editedTransactionId: req.params.transactionId
  });
}

//// SETTLEMENTS

exports.addSettlement = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)

  var newTransaction = new transactionModel(req.body)
  recurring.settlements.push(newTransaction);

  await doc.save()
  res.json({
    message: 'settlement successfully added',
    addedSettlement: newTransaction
  });
}

exports.removeSettlement = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)

  recurring.settlements = recurring.settlements.filter((transaction) => {
    return req.params.transactionId != transaction._id
  })

  await doc.save()

  //console.log(req.params)
  res.json({
    message: 'settlement successfully removed',
    removedSettlementId: req.params.transactionId
  });
}

exports.editSettlement = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var recurring = account.recurring.id(req.params.recurringId)
  var transaction = recurring.settlements.id(req.params.transactionId)

  transaction['title'] = req.body.title
  transaction['amount'] = req.body.amount
  transaction['date'] = req.body.date

  await doc.save()

  //console.log(req.params)
  //console.log(req.body)
  res.json({
    message: 'settlement successfully edited',
    editedSettlementId: req.params.transactionId
  });
}