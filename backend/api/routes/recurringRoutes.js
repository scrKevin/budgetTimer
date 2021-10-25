const recurringController = require('../controllers/recurringController');
const auth = require('../../config/auth')

module.exports = app => {
  app
    .route('/api/user/account/:accountId/recurring')
    .post(auth, recurringController.addRecurring)

  app
    .route('/api/user/account/:accountId/recurring/:recurringId')
    .put(auth, recurringController.updateRecurring)
    .delete(auth, recurringController.removeRecurring)

  app
    .route('/api/user/account/:accountId/recurring/:recurringId/transactions')
    .post(auth, recurringController.addTransaction)

  app
    .route('/api/user/account/:accountId/recurring/:recurringId/transactions/:transactionId')
    .put(auth, recurringController.editTransaction)
    .delete(auth, recurringController.removeTransaction)

  app
    .route('/api/user/account/:accountId/recurring/:recurringId/settlements')
    .post(auth, recurringController.addSettlement)

  app
    .route('/api/user/account/:accountId/recurring/:recurringId/settlements/:transactionId')
    .put(auth, recurringController.editSettlement)
    .delete(auth, recurringController.removeSettlement)
};