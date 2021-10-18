export default {
  
  methods: {
    calcDueIn (item, now) {
      var startdate = new Date(Date.parse(item.startdate))
      var nowSec = now.getTime()
      var secondsDue = 0
      var length
      if (item.periodType == 'month') {
        if (item.period == 1)
        {
          var elapsed
          
          var sdThisMonth = new Date(now.getFullYear(), now.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
          if (sdThisMonth < now) {
            var sdNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
            length = sdNextMonth.getTime() - sdThisMonth.getTime()
            elapsed = now.getTime() - sdThisMonth.getTime()
          }
          else {
            var sdPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
            length = sdThisMonth.getTime() - sdPreviousMonth.getTime()
            elapsed = now.getTime() - sdPreviousMonth.getTime()
          }
          secondsDue = (length - elapsed) / 1000
        }
        else {
          var refDate = new Date(startdate.getFullYear(), startdate.getMonth(), startdate.getDate(), startdate.getHours(), startdate.getMinutes(), startdate.getSeconds(), startdate.getMilliseconds())
          while (now > refDate) {
            refDate = new Date(refDate.getFullYear(), refDate.getMonth() + item.period, refDate.getDate(), refDate.getHours(), refDate.getMinutes(), refDate.getSeconds(), refDate.getMilliseconds())
          }
          var refSec = refDate.getTime()
          secondsDue = (refSec - nowSec) / 1000
        }
      }
      else if (item.periodType == "week" || item.periodType == "year" || item.periodType == "day") {
        if (item.periodType == "week") {
          length = 1000*60*60*24*7 * item.period
        }
        else if (item.periodType == "year") {
          length = 1000*60*60*24*365 * item.period
        }
        else if (item.periodType == "day") {
          length = 1000*60*60*24 * item.period
        }
        var sdSec = startdate.getTime()
        var diff = nowSec - sdSec
        var n = parseInt(diff / length)
        var next = sdSec + ((n+1) * length)
        secondsDue = (next - nowSec) / 1000
      }
      return secondsDue  
    },
    calcVelocity (item) {
      var multiplier = 1
      var length
      if (item.periodType == 'month'){
        multiplier = 12
        length = 1000*60*60*24*365 * item.period
      }
      else if (item.periodType == 'day') {
        length = 1000*60*60*24 * item.period
      }
      else if (item.periodType == 'week') {
        length = 1000*60*60*24*7 * item.period
      }
      else if (item.periodType == 'year') {
        length = 1000*60*60*24*365 * item.period
      }
      var velocity = (item.amount * multiplier) / (length / 1000)
      return velocity
    },
    calcBalance: function(item, accountStartdate) {
      var startdate = new Date(Date.parse(item.startdate))
      var enddate = new Date()
      console.log(accountStartdate)
      // if (startdate < new Date(Date.parse(accountStartdate))){
      //   startdate = new Date(Date.parse(accountStartdate))
      // }
      var totalTransactions = 0
      for (let transaction of item.transactions) {
        totalTransactions += transaction.amount
      }
      var totalSettlements = 0
      for (let settlement of item.settlements) {
        totalSettlements += settlement.amount
      }
      if (item.ended) {
        enddate = new Date(Date.parse(item.enddate))
      }
      return (-1 * ((enddate - startdate) / 1000) * item.velocity) + totalTransactions + totalSettlements + (-1*item.amount)
    },
    calcRecurringBalance: function(item) {
      // var balance = 0
      var balance = item.amount * (item.previousTransactions.length + 1); 
      var totalTransactions = 0
      var totalSettlements = 0
      for (let transaction of item.transactions) {
        totalTransactions += transaction.amount
      }
      for (let settlement of item.settlements) {
        totalSettlements += settlement.amount
      }
      return (-1*balance) + totalTransactions + totalSettlements
    },
    updateItem (item, now, accountStartdate) {
      item.dueIn = this.calcDueIn(item, now)
      item.velocity = this.calcVelocity(item)
      item.balance = this.calcBalance(item, accountStartdate)
      

      item.previousTransactions = [];
      var lastTransaction = new Date(Date.parse(item.startdate)).getTime();
      var calcUntil = now.getTime()
      if (item.ended) {
        calcUntil = new Date(Date.parse(item.enddate))
      }
      var length = 1000*60*60*24*30

      if (item.periodType == "month") {
        while (lastTransaction < calcUntil) {
          var lastTransactionDate = new Date(lastTransaction)
          var nextMonth = (lastTransactionDate.setMonth(lastTransactionDate.getMonth() + item.period))
          if (nextMonth < calcUntil) {
            item.previousTransactions.push(nextMonth)
          }
          lastTransaction = nextMonth
        }
      } else {
        if (item.periodType == "week") {
          length = 1000*60*60*24*7 * item.period
        }
        else if (item.periodType == "year") {
          length = 1000*60*60*24*365 * item.period
        }
        else if (item.periodType == "day") {
          length = 1000*60*60*24 * item.period
        }

        while (lastTransaction < calcUntil) {
          var next = lastTransaction + length
          if (next < calcUntil) {
            item.previousTransactions.push(next);
          }
          lastTransaction = next;
        }
      }

      item.recurringBalance = this.calcRecurringBalance(item)

      item.upcomingTransactions = [];
      item.nextTransactions = [];
      if (!item.ended)
      {
        lastTransaction = new Date(Date.parse(item.startdate)).getTime();
        calcUntil = now.getTime() + (1000*60*60*24*365*2)
        length = 1000*60*60*24*30
        if (item.periodType == "month") {
          while (lastTransaction < calcUntil) {
            lastTransactionDate = new Date(lastTransaction)
            nextMonth = (lastTransactionDate.setMonth(lastTransactionDate.getMonth() + item.period))
            if (nextMonth > now.getTime()) {
              item.upcomingTransactions.push(nextMonth)
            }
            lastTransaction = nextMonth
          }
        } else {
          if (item.periodType == "week") {
            length = 1000*60*60*24*7 * item.period
          }
          else if (item.periodType == "year") {
            length = 1000*60*60*24*365 * item.period
          }
          else if (item.periodType == "day") {
            length = 1000*60*60*24 * item.period
          }

          while (lastTransaction < calcUntil) {
            next = lastTransaction + length
            if (next > now.getTime()) {
              item.upcomingTransactions.push(next);
            }
            lastTransaction = next;
          }
        }
      }
    },
    sortBySecondsDue( a, b ) {
      if ( a.dueIn < b.dueIn ){
        return -1;
      }
      if ( a.dueIn > b.dueIn ){
        return 1;
      }
      return 0;
    },
    updateAccount(account, now) {
      account.totalRecurringVelocity = 0;
      account.totalRecurringBalance = 0;

      account.expected = 0

      var nowMs = now.getTime()
      var future = {}
      for (var i = 0; i < 365*2; i++) {
        future[(nowMs + (i * (1000*60*60*24)))] = 0
      }

      var currentBalance = account.startbalance

      //console.log(future)

      for (let recurring of account.recurring) {
        this.updateItem(recurring, now, account.startdate)
        //console.log(recurring.upcomingTransactions)
        if (!recurring.ended) {
          account.totalRecurringVelocity += recurring.velocity
        }
        account.totalRecurringBalance += recurring.recurringBalance
        account.expected += recurring.recurringBalance
        //currentBalance -= recurring.recurringBalance
        for (let transaction of recurring.transactions) {
          currentBalance += transaction.amount
        }
      }
      account.recurring = account.recurring.sort(this.sortBySecondsDue)
      
      account.totalBudgetVelocity = 0;
      for (let budget of account.budgets) {
        this.updateItem(budget, now, account.startdate)
        if (!budget.ended) {
          account.totalBudgetVelocity += budget.velocity
        }
        account.expected += budget.recurringBalance
        for (let transaction of budget.transactions) {
          currentBalance += transaction.amount
        }
        // for (let settlement of budget.settlements) {
        //   currentBalance -= settlement.amount
        // }
      }

      for (let transaction of account.transactions) {
        currentBalance += transaction.amount
      }

      //console.log(currentBalance)
      account.currentBalance = currentBalance
      
      var predictedBalance = currentBalance
      
      for (var ms in future) {
        for (let recurring of account.recurring) {
          if (!recurring.ended) {
            if (recurring.upcomingTransactions[0] < ms) {
              predictedBalance += recurring.amount
              
              recurring.nextTransactions.push(recurring.upcomingTransactions.shift())
            }
          }
        }
        for (let budget of account.budgets) {
          if (!budget.ended) {
            if (budget.upcomingTransactions[0] < ms) {
              predictedBalance += budget.amount
              budget.nextTransactions.push(budget.upcomingTransactions.shift())
            }
          }
        }
        future[ms] = predictedBalance
      }
      console.log(account)
      console.log(future)

      // let key = Object.keys(future).reduce((key, v) => future[v] < future[key] ? v : key)
      // console.log("Lowest at: " + new Date(+key) + " = " + future[key])
      // account.lowestDate = new Date(+key)
      // account.lowestBalance = future[key]

    },
    calcComputedProperties(user) {
      var now = new Date();
      for (let account of user.accounts) {
        this.updateAccount(account, now)
      }
    }
  },
};