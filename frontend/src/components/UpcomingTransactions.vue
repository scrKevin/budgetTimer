 <template>
  <span>
    {{ dateWithLowestBalance.balance.toFixed(2) }} @ {{ dateWithLowestBalance.date.toLocaleString("NL-nl") }} <br>
    Below {{ account.maxCredit }} @ {{ dateWithLowestBalance.firstDateBelowMaxCredit.toLocaleString("NL-nl") }} <br>
    Spendable: {{ dateWithLowestBalance.spendable.toFixed(2) }}
    <input type="checkbox" v-model="showUpcomingList"/>
    <ul class="upcomingTransactionsList" v-if="showUpcomingList">
      <li v-for="transaction in totalNextTransactions" :key=transaction.id>
        {{ transaction.balance.toFixed(2) }} @{{ transaction.time.toLocaleString("NL-nl") }} : {{ transaction.title }} {{ transaction.amount }}
      </li>
    </ul>
    <div class="chartAreaWrapper">
      <line-chart :chart-data="chartData" :options="chartOptions" style="float: left" class="balance-chart"></line-chart>
    </div>
  </span>
</template>

<script>

import LineChart from './LineChart.js'

export default {
  name: 'UpcomingTransactions',
  components: { LineChart },
  props: ["account"],
  data() {
    return {
      showUpcomingList: false,
      chartOptions: { 
        responsive: true,
        maintainAspectRatio: false,
        // Container for pan options
        pan: {
          // Boolean to enable panning
          enabled: true,

          // Panning directions. Remove the appropriate direction to disable
          // Eg. 'y' would only allow panning in the y direction
          mode: 'xy'
        },
        scales: {
          xAxes: [{
            type: 'time', // MANDATORY TO SHOW YOUR POINTS! (THIS IS THE IMPORTANT BIT) 
            display: true, // mandatory
            scaleLabel: {
              display: true, // mandatory
            },
          }], 
          yAxes: [{ // and your y axis customization as you see fit...
            display: true,
            scaleLabel: {
              display: true,
            }
          }],
        }
      }
    };
  },
  methods: {
    sortByTime( a, b ) {
      if ( a.time < b.time ){
        return -1;
      }
      if ( a.time > b.time ){
        return 1;
      }
      return 0;
    },
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  },
  computed: {
    dateWithLowestBalance: function() {
      var lowestDate = 0;
      var lowestBalance = 999999999999999;
      var firstDateBelowMaxCredit = -1;
      var wentBelowMaxCredit = false;
      for (let transaction of this.totalNextTransactions) {
        if (transaction.balance < lowestBalance) {
          lowestBalance = transaction.balance
          lowestDate = transaction.time
        }
        if (!wentBelowMaxCredit) {
          if (transaction.balance < this.account.maxCredit) {
            firstDateBelowMaxCredit = transaction.time
            wentBelowMaxCredit = true
          }
        }
      }
      var spendable = -1 * (this.account.maxCredit - lowestBalance)
      return {date: lowestDate, balance: lowestBalance, firstDateBelowMaxCredit: firstDateBelowMaxCredit, spendable: spendable}
    },
    chartData: function () {
      var data = [];
      var spendableData = [];
      for (let transaction of this.totalNextTransactions) {
        data.push({x: transaction.time, y: transaction.balance})
        spendableData.push({x: transaction.time, y: transaction.spendable})
      }
      var minData = [
        {
          x: this.totalNextTransactions[0].time,
          y: this.account.maxCredit
        },
        {
          x: this.totalNextTransactions[this.totalNextTransactions.length -1].time,
          y: this.account.maxCredit
        }
      ];
      //console.log(data)
      var datacollection = {
        datasets: [
          {
            label: 'Upcoming',
            backgroundColor: 'rgb(75, 192, 192)',
            data: data,
            "fill":false,
            "borderColor":"rgb(75, 192, 192)",
            "lineTension":0.1
          },
          {
            label: 'Min balance',
            backgroundColor: 'rgb(255, 0, 0)',
            data: minData,
            "fill":false,
            "borderColor":"rgb(255, 0, 0)",
            "lineTension":0.1
          },
          {
            label: 'Spendable',
            backgroundColor: 'rgb(0, 255, 0)',
            data: spendableData,
            "fill":false,
            "borderColor":"rgb(0, 255, 0)",
            "lineTension":0.1
          }
        ]
      }
      
      return datacollection
    },
    totalNextTransactions: function () {
      //console.log("test next transactions")
      var totalArray = [];
      var nextId = 0;
      for (let recurring of this.account.recurring) {
        if (!recurring.ended)
        {
          for (let time of recurring.nextTransactions) {
            
            totalArray.push({
              id: nextId,
              title: recurring.title,
              amount: recurring.amount,
              time: new Date(+time),
            })
            nextId++;
          }
        }
      }
      for (let budget of this.account.budgets) {
        if (!budget.ended)
        {
          let savings = 0
          let toSettle = 0
          if (budget.recurringBalance > 0 && budget.velocity > 0) {
            savings = budget.recurringBalance
            if (savings < budget.amount) {
              toSettle = savings
            }
            else {
              toSettle = budget.amount
            }
          }
          for (let time of budget.nextTransactions) {
            
            totalArray.push({
              id: nextId,
              title: budget.title,
              amount: budget.amount - toSettle,
              time: new Date(+time),
            })

            if (savings > 0)
            {
              savings -= toSettle
              if (savings < budget.amount) {
                toSettle = savings
              }
              else {
                toSettle = budget.amount
              }
            }
            else {
              toSettle = 0
              savings = 0
            }
            nextId++;
          }
        }
      }
      for (let reservation of this.account.reservations) {
        totalArray.push({
            id: nextId,
            title: reservation.title,
            amount: reservation.amount,
            time: new Date(Date.parse(reservation.date)),
          })
          nextId++;
      }
      totalArray = totalArray.sort(this.sortByTime);
      var balance = this.account.currentBalance - this.account.expected;
      for (let transaction of totalArray) {
        balance += transaction.amount;
        transaction.balance = balance;
      }

      var reversedLowest = 99999999999999;
      for (var i = totalArray.length - 1; i >= 0; i--) {
        if (totalArray[i].balance < reversedLowest) {
          reversedLowest = totalArray[i].balance
        }
        totalArray[i].spendable = -1 * (this.account.maxCredit - reversedLowest)
      }
      return totalArray
    }
  },
  watch: {
 
  },
  mounted() {

  }
};
</script>

<style scoped>
.upcomingTransactionsList {
  max-height: 300px;
  overflow: scroll;
  max-width: 80%;
}

.chartAreaWrapper {
  width: 100%;
  overflow-x: scroll;
}

.balance-chart{
  margin-top: 20px;
  height: 500px;
  width: 6000px;
}
</style>