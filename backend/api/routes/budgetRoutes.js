const budgetController = require('../controllers/budgetController');
const auth = require('../../config/auth')

module.exports = app => {
  app
    .route('/api/user/account/:accountId/budgets')
    .post(auth, budgetController.addBudget)

  app
    .route('/api/user/account/:accountId/budgets/:budgetId')
    .put(auth, budgetController.updateBudget)
    .delete(auth, budgetController.removeBudget)

  app
    .route('/api/user/account/:accountId/budgets/:budgetId/transactions')
    .post(auth, budgetController.addTransaction)

  app
    .route('/api/user/account/:accountId/budgets/:budgetId/transactions/:transactionId')
    .put(auth, budgetController.editTransaction)
    .delete(auth, budgetController.removeTransaction)

  app
    .route('/api/user/account/:accountId/budgets/:budgetId/settlements')
    .post(auth, budgetController.addSettlement)

  app
    .route('/api/user/account/:accountId/budgets/:budgetId/settlements/:transactionId')
    .put(auth, budgetController.editSettlement)
    .delete(auth, budgetController.removeSettlement)
};