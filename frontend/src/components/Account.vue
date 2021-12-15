<template>
  <!-- <li style="border-bottom: 2px solid black; padding: 20px;">
    <div>
      <div>{{ account.name }}
      <AccountForm v-bind:new="false" v-bind:toEdit="this.account" @editedAccount='editAccount'></AccountForm>
      <b-button variant="danger" @click="deleteThisAccount">
        ×
      </b-button>
      </div>
    </div>
    <span>
      <RecurringList :recurringList="myAccount.recurring" :account="myAccount"></RecurringList>
    </span>
    <div>Total recurring velocity: {{ (account.totalRecurringVelocity * 60 * 60).toFixed(4) }} €/h - Balance: {{ account.totalRecurringBalance.toFixed(2) }}</div>
    <span>
      <BudgetList :budgetList="myAccount.budgets" :account="myAccount"></BudgetList>
    </span>
    <div>Total budget velocity: {{ (account.totalBudgetVelocity * 60 * 60).toFixed(4) }}</div>
    <div>Total recurring account velocity: {{ totalAccountRecurringVelocity }}</div>
    <h2>Transactions:</h2>
    <TransactionList 
        :parentId="account._id"
        :type="this.transactionType"
        :transactionList="account.transactions"
        @newTransaction='newTransaction'
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
    </TransactionList>
    <h2>Reservations:</h2>
    <TransactionList 
        :parentId="account._id"
        :type="this.reservationType"
        :transactionList="account.reservations"
        @newTransaction='newReservation'
        @removeTransaction="removeReservation"
        @editedTransaction="editReservation"
      >
    </TransactionList>
    <div>Current balance: {{ myAccount.currentBalance.toFixed(2) }}</div>
    <div>Expected: {{ (-1*myAccount.expected).toFixed(2) }}</div>
    <UpcomingTransactions :account="this.account" ></UpcomingTransactions>
  </li> -->
  <div class="row">
    <div class="col-xs-12">
      <h3>{{ account.name }} {{ myAccount.currentBalance.toFixed(2) }}
      <AccountForm v-bind:new="false" v-bind:toEdit="this.account" @editedAccount='editAccount'></AccountForm>
      <b-button variant="danger" @click="deleteThisAccount">
        ×
      </b-button></h3>
    </div>
    <div class="col-xs-12">
      Total recurring account velocity: {{ totalAccountRecurringVelocity.hour }} €/hour / {{ totalAccountRecurringVelocity.month }} €/month / {{ totalAccountRecurringVelocity.year }} €/year
    </div>
    <!-- <div class="col-xs-12"> -->
      <RecurringList 
        :recurringList="myAccount.recurring" 
        :account="myAccount"
        @recurringUpdated="itemUpdated">
      </RecurringList>
    <!-- </div> -->
    <div class="col-xs-12">
      <BudgetList 
        :budgetList="myAccount.budgets" 
        :account="myAccount" 
        @budgetUpdated="itemUpdated">
      </BudgetList>
    </div>
    <div class="col-xs-12">
      <h4>Transactions: {{ myAccount.transactions.length }} <input type="checkbox" v-model="showTransactions"/></h4>
      <TransactionForm 
        v-bind:new="true"
        :type="this.transactionType"
        v-bind:parentId="myAccount._id"
        @newTransaction='newTransaction'
      > 
      </TransactionForm>
    </div>
    <div class="col-xs-12">
      <TransactionList 
        v-if="showTransactions"
        :parentId="account._id"
        :type="this.transactionType"
        :transactionList="account.transactions"
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
      </TransactionList>
    </div>
    <div class="col-xs-12">
      <h4>Reservations:{{ myAccount.reservations.length }} <input type="checkbox" v-model="showReservations"/></h4>
      <TransactionForm 
        v-bind:new="true"
        :type="this.reservationType"
        v-bind:parentId="myAccount._id"
        @newTransaction='newReservation'
      > 
      </TransactionForm>
    </div>
    <div class="col-xs-12">
      <TransactionList
        v-if="showReservations"
        :parentId="account._id"
        :type="this.reservationType"
        :transactionList="account.reservations"
        @removeTransaction="removeReservation"
        @editedTransaction="editReservation"
      >
    </TransactionList>
    </div>
    <div class="col-xs-12">
      <div>Expected: {{ (-1*myAccount.expected).toFixed(2) }}</div>
    </div>
    <div class="col-xs-12">
      <UpcomingTransactions :account="this.account" ></UpcomingTransactions>
    </div>
  </div>
</template>

<script>
  import AccountForm from "./AccountForm.vue"
  import RecurringList from "./RecurringList.vue"
  import BudgetList from "./BudgetList.vue"
  import TransactionList from "./TransactionList.vue"
  import TransactionForm from '../components/TransactionForm.vue'
  import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
  import UpcomingTransactions from "./UpcomingTransactions.vue"
  export default {
    props: ["account"],
    mixins: [RecurringBudgetsMethods],
    components: {
      AccountForm,
      RecurringList,
      BudgetList,
      TransactionList,
      TransactionForm,
      UpcomingTransactions
    },
    data() {
      return {
        showTransactions: false,
        showReservations: false,
        myAccount: this.account,
        transactionType: "transaction",
        reservationType: "reservation",
        settlementType: "settlement"
      }
    },
    methods: {
      async deleteThisAccount () {
        if (confirm("Delete " + this.myAccount.name + "?")) {
          let response = await this.$http.delete(`/user/account/${this.account._id}`);
          this.$emit("removedAccount", response.data.deletedAccountId)
        }
      },
      editAccount (editedAccountId, data) {
        this.myAccount.name = data.name
        this.myAccount.startbalance = data.startbalance
        this.myAccount.startdate = data.startdate
        //this.$emit("editedAccount", editedAccountId, data)
      },
      itemUpdated() {
        var now = new Date()
        this.updateAccount(this.myAccount, now)
      },
      async newTransaction(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/transactions/`, transactionToAdd);
        this.myAccount.transactions.push(response.data.addedTransaction)
        //console.log(response)
      },
      async removeTransaction(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/transactions/${transactionToRemove._id}`);
        console.log(response)
      },
      async editTransaction(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/transactions/${editedTransactionId}`, editedTransaction);
        console.log(response)
      },
      async newReservation(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/reservations/`, transactionToAdd);
        this.myAccount.reservations.push(response.data.addedTransaction)
        //console.log(response)
      },
      async removeReservation(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/reservations/${transactionToRemove._id}`);
        console.log(response)
      },
      async editReservation(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/reservations/${editedTransactionId}`, editedTransaction);
        console.log(response)
      }
    },
    mounted () {
      //this.interval = setInterval(this.updateBalance, 2000)
      //this.getVelocity()
      //this.$emit('onVelocity', this.velocity)
    },
    beforeDestroy() {
      //clearInterval(this.interval);
    },
    computed: {
      totalAccountRecurringVelocity: function() {
        var vH = (this.myAccount.totalRecurringVelocity + this.myAccount.totalBudgetVelocity) * 60 *60
        var vM = vH * 24 * 30
        var vY = vH * 24 * 365
        return {hour: vH.toFixed(6), month: vM.toFixed(2), year: vY.toFixed(2)}
      }
    },
    watch: {
      account: function (newVal) {
        this.updateAccount(newVal)
        this.myAccount = newVal
        console.log(this.myAccount)
      }
    }
  };
  
</script>

<style scoped>
.row {
  border: 4px solid #0dcaf0;
  border-radius: 5px;
  padding: 6px;
  margin-bottom: 5px;
}
</style>