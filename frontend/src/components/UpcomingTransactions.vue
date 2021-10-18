 <template>
  <span>
    {{ dateWithLowestBalance.balance.toFixed(2) }} @ {{ dateWithLowestBalance.date.toLocaleString("NL-nl") }}
    <ul>
      <li v-for="transaction in totalNextTransactions" :key=transaction.id>
        {{ transaction.balance.toFixed(2) }} @{{ transaction.time.toLocaleString("NL-nl") }} : {{ transaction.title }} {{ transaction.amount }}
      </li>
    </ul>
  </span>
</template>

<script>

export default {
  name: 'UpcomingTransactions',
  props: ["account"],
  data() {
    return {
      
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
  },
  computed: {
    dateWithLowestBalance: function() {
      var lowestDate = 0;
      var lowestBalance = 999999999999999;
      for (let transaction of this.totalNextTransactions) {
        if (transaction.balance < lowestBalance) {
          lowestBalance = transaction.balance
          lowestDate = transaction.time
        }
      }
      return {date: lowestDate, balance: lowestBalance}
    },
    totalNextTransactions: function () {
      console.log("test next transactions")
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
          for (let time of budget.nextTransactions) {
            
            totalArray.push({
              id: nextId,
              title: budget.title,
              amount: budget.amount,
              time: new Date(+time),
            })
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
      return totalArray
    }
  },
  watch: {
 
  },
  mounted() {

  }
};
</script>