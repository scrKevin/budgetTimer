const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const budgetModel = mongoose.model('Budget');
const transactionModel = mongoose.model('Transaction');

exports.addBudget = async (req, res) => {
  newBudget = new budgetModel(req.body)
  userModel.updateOne(
    {
      _id: req.userData._id,
      "accounts._id": req.params.accountId
    },
    {
      $push: {
        "accounts.$.budgets": newBudget
      }
    },
    { new: true },
    (err, user) => {
      if (err) res.send(err);
      res.json({
        message: 'budget successfully added',
        addedBudget: newBudget
      });
    }
  )
}

exports.removeBudget = async (req, res) => {
  userModel.updateOne(
    {
      _id: req.userData._id,
      "accounts._id": req.params.accountId,
    },
    {
      $pull: {
        "accounts.$.budgets": { _id: req.params.budgetId }
      }
    },
    (err, user) => {
      if (err) res.send(err);
      res.json({
        message: 'budget successfully deleted',
        deletedBudgetId: req.params.budgetId
      });
    }
  )
}

exports.updateBudget = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var budget = account.budgets.id(req.params.budgetId)
  budget["title"] = req.body.title
  budget["amount"] = req.body.amount
  budget["startdate"] = req.body.startdate
  budget["ended"] = req.body.ended
  budget["enddate"] = req.body.enddate
  budget["period"] = req.body.period
  budget["periodType"] = req.body.periodType

  await doc.save()
  res.json({
    message: 'budget successfully edited',
    editedBudgetId: budget._id
  });
}

exports.addTransaction = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var budget = account.budgets.id(req.params.budgetId)

  var newTransaction = new transactionModel(req.body)
  budget.transactions.push(newTransaction);

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
  var budget = account.budgets.id(req.params.budgetId)

  budget.transactions = budget.transactions.filter((transaction) => {
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
  var budget = account.budgets.id(req.params.budgetId)
  var transaction = budget.transactions.id(req.params.transactionId)

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

// SETTLEMENTS

exports.addSettlement = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var budget = account.budgets.id(req.params.budgetId)

  var newTransaction = new transactionModel(req.body)
  budget.settlements.push(newTransaction);

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
  var budget = account.budgets.id(req.params.budgetId)

  budget.settlements = budget.settlements.filter((transaction) => {
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
  var budget = account.budgets.id(req.params.budgetId)
  var transaction = budget.settlements.id(req.params.transactionId)

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