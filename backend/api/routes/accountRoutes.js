const accountController = require('../controllers/accountController');
const auth = require('../../config/auth')

module.exports = app => {

  app
  .route('/api/user/account')
  .post(auth, accountController.add_account)

  app
  .route('/api/user/account/:accountId')
  .put(auth, accountController.update_account)
  .delete(auth, accountController.remove_account)

  app
    .route('/api/user/account/:accountId/transactions')
    .post(auth, accountController.addTransaction)

  app
    .route('/api/user/account/:accountId/transactions/:transactionId')
    .put(auth, accountController.editTransaction)
    .delete(auth, accountController.removeTransaction)

  app
    .route('/api/user/account/:accountId/reservations')
    .post(auth, accountController.addReservation)

  app
    .route('/api/user/account/:accountId/reservations/:transactionId')
    .put(auth, accountController.editReservation)
    .delete(auth, accountController.removeReservation)

}