const userController = require('../controllers/userController');
const auth = require('../../config/auth')

module.exports = app => {
  app
    .route('/api/user')
    //.get(auth, userController.list_all_users)
    .post(userController.create_a_user);
  
   app
    .route('/api/user/:userId')
    .get(auth, userController.get_a_user)
    .put(auth, userController.update_a_user)
    .delete(auth, userController.delete_a_user);

  app
    .route('/api/user/login')
    .post(userController.login_user)
  
  app
    .route('/api/user/me')
    .get(auth, userController.getUserDetails)

  app
    .route('/api/user/me/logout')
    .post(auth, userController.logout_user)

  app
    .route('/api/user/:userId/import-accounts')
    .post(auth, userController.importAccounts)
};