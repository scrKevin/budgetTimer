const accountController = require('../controllers/accountController');
const auth = require('../../config/auth')

module.exports = app => {

  app
  .route('/user/account')
  .post(auth, accountController.add_account)

  app
  .route('/user/account/:accountId')
  .put(auth, accountController.update_account)
  .delete(auth, accountController.remove_account)

  app
    .route('/user/account/:accountId/transactions')
    .post(auth, accountController.addTransaction)

  app
    .route('/user/account/:accountId/transactions/:transactionId')
    .put(auth, accountController.editTransaction)
    .delete(auth, accountController.removeTransaction)

  app
    .route('/user/account/:accountId/reservations')
    .post(auth, accountController.addReservation)

  app
    .route('/user/account/:accountId/reservations/:transactionId')
    .put(auth, accountController.editReservation)
    .delete(auth, accountController.removeReservation)

}