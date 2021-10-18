const recurringRoutes = require('./recurringRoutes')
const userRoutes = require('./userRoutes')
const accountRoutes = require('./accountRoutes')
const budgetRoutes = require('./budgetRoutes')

module.exports = app => {
  userRoutes(app)
  accountRoutes(app)
  recurringRoutes(app)
  budgetRoutes(app)
};