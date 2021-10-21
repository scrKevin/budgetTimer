const mongoose = require('mongoose');
const userModel = mongoose.model('User');
const accountModel = mongoose.model('Account')
const transactionModel = mongoose.model('Transaction')

exports.add_account = async (req, res) => {
  var user = await userModel.findOne({_id: req.userData._id})
  const newAccount = new accountModel(req.body)
  user.accounts.push(newAccount)
  await user.save()
  res.json({
    message: 'account successfully added',
    addedAccount: newAccount
  });
}

exports.remove_account = async (req, res) => {
  var user = await userModel.findOne({_id: req.userData._id})
  user.accounts = user.accounts.filter((account) => {
    return account._id != req.params.accountId
  })
  await user.save()
  res.json({
    message: 'account successfully deleted',
    deletedAccountId: req.params.accountId
  });
}

exports.update_account = async (req, res) => {
  var user = await userModel.findOne({
    _id: req.userData._id
  })
  var account = user.accounts.id(req.params.accountId)
  account['name'] = req.body.name
  account['startdate'] = req.body.startdate
  account['startbalance'] = req.body.startbalance
  account['maxCredit'] = req.body.maxCredit
  await user.save()
  res.json({
    message: 'account successfully edited',
    editedAccountId: account._id
  });
}

exports.addTransaction = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)

  var newTransaction = new transactionModel(req.body)
  account.transactions.push(newTransaction);

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

  account.transactions = account.transactions.filter((transaction) => {
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
  var transaction = account.transactions.id(req.params.transactionId)

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

/// RESERVATIONS

exports.addReservation = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)

  var newTransaction = new transactionModel(req.body)
  account.reservations.push(newTransaction);

  await doc.save()
  res.json({
    message: 'reservation successfully added',
    addedReservation: newTransaction
  });
}

exports.removeReservation = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)

  account.reservations = account.reservations.filter((transaction) => {
    return req.params.transactionId != transaction._id
  })

  await doc.save()

  //console.log(req.params)
  res.json({
    message: 'reservations successfully removed',
    removedReservationId: req.params.transactionId
  });
}

exports.editReservation = async (req, res) => {
  var doc = await userModel.findOne({
    _id: req.userData._id
  })
  var account = doc.accounts.id(req.params.accountId)
  var transaction = account.reservations.id(req.params.transactionId)

  transaction['title'] = req.body.title
  transaction['amount'] = req.body.amount
  transaction['date'] = req.body.date

  await doc.save()

  //console.log(req.params)
  //console.log(req.body)
  res.json({
    message: 'reservation successfully edited',
    editedReservationId: req.params.transactionId
  });
}