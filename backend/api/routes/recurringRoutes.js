const recurringController = require('../controllers/recurringController');

module.exports = app => {
  app
    .route('/recurring')
    .get(recurringController.list_all_recurring)
    .post(recurringController.create_a_recurring);

  app
    .route('/recurring/:recurringId')
    .get(recurringController.read_a_recurring)
    .put(recurringController.update_a_recurring)
    .delete(recurringController.delete_a_recurring);
};