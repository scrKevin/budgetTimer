<template>
  <!-- <li>
    <span>
      {{ (this.myBudget.velocity * (60*60)).toFixed(6) }} €/h {{ this.myBudget.title }} ({{ this.myBudget.amount }} per {{ this.myBudget.period }} {{ this.myBudget.periodType }}), balance: {{ this.myBudget.balance.toFixed(4) }} (expected: {{ this.myBudget.recurringBalance.toFixed(2) }})
      <BudgetForm v-bind:new="false" v-bind:toEdit="this.budget" @editedBudget='editBudget'></BudgetForm>
      <b-button variant="danger" @click="deleteThisBudget">
        ×
      </b-button>
      <TransactionList 
        :parentId="budget._id"
        :type="this.transactionType"
        :transactionList="budget.transactions"
        @newTransaction='newTransaction'
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
      </TransactionList>
      <TransactionList 
        :parentId="budget._id"
        :type="this.settlementType"
        :transactionList="budget.settlements"
        @newTransaction='newSettlement'
        @removeTransaction="removeSettlement"
        @editedTransaction="editSettlement"
      >
      </TransactionList>
    </span>
  </li> -->
  <div class="row">
    <div class="col-xs-3 col-md-1">{{ (this.myBudget.velocity * (60*60)).toFixed(6) }}</div>
    <div class="col-xs-5 col-md-3">{{ this.myBudget.title }} ({{ this.myBudget.amount }} per {{ this.myBudget.period }} {{ this.myBudget.periodType }})</div>
    <div class="col-xs-4 col-md-1">{{ this.dueIn }}</div>
    <div class="col-xs-2 col-md-1">{{ this.myBudget.balance.toFixed(2) }} ({{ this.myBudget.recurringBalance.toFixed(2) }})</div>
    <div class="col-xs-2 col-md-1"><BudgetForm v-bind:new="false" v-bind:toEdit="this.budget" @editedBudget='editBudget'></BudgetForm></div>
    <div class="col-xs-2 col-md-1"><b-button variant="danger" @click="deleteThisBudget">
        ×
      </b-button></div>
    <div class="col-xs-3 col-md-2">
      <TransactionForm 
        v-bind:new="true"
        :type="this.transactionType"
        v-bind:parentId="budget._id"
        @newTransaction='newTransaction'
      > 
      </TransactionForm>
      <input class="form-check-input" type="checkbox" v-model="transactionsVisible" style="margin: 9px;">
    </div>
    <div class="col-xs-3 col-md-2">
      <TransactionForm 
        v-bind:new="true"
        :type="this.settlementType"
        v-bind:parentId="budget._id"
        @newTransaction='newSettlement'
      > 
      </TransactionForm>
      <input class=" form-check-input" type="checkbox" v-model="settlementsVisible" style="margin: 9px;">
    </div>
    <div class="col-xs-12" v-if="transactionsVisible">
      <h4>Transactions:</h4>
      <TransactionList 
        :parentId="budget._id"
        :type="this.transactionType"
        :transactionList="budget.transactions"
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
      </TransactionList>
    </div>
    <div class="col-xs-12" v-if="settlementsVisible">
      <h4>Settlements:</h4>
      <TransactionList 
        :parentId="budget._id"
        :type="this.settlementType"
        :transactionList="budget.settlements"
        @removeTransaction="removeSettlement"
        @editedTransaction="editSettlement"
      >
      </TransactionList>
    </div>
  </div>
</template>

<script>
  import BudgetForm from "./BudgetForm.vue"
  import TransactionList from "./TransactionList.vue"
  import TransactionForm from '../components/TransactionForm.vue'
  import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
  export default {
    props: ["budget", "account"],
    mixins: [RecurringBudgetsMethods],
    components: {
      BudgetForm,
      TransactionList,
      TransactionForm
    },
    data() {
      return {
        myBudget: this.budget,
        transactionType: "transaction",
        settlementType: "settlement",
        transactionsVisible: false,
        settlementsVisible: false
      }
      
    },
    methods: {
      deleteThisBudget () {
        if(confirm("Do you really want to delete " + this.myBudget.title + "?")){
          this.$emit("removeBudget", this.myBudget)
        }
      },
      editBudget (editedBudget) {
        var now = new Date()
        this.$emit("editedBudget", this.myBudget._id, editedBudget)
        this.myBudget.title = editedBudget.title
        this.myBudget.amount = editedBudget.amount
        this.myBudget.startdate = editedBudget.startdate
        this.myBudget.ended = editedBudget.ended
        this.myBudget.enddate = editedBudget.enddate
        this.myBudget.period = editedBudget.period
        this.myBudget.periodType = editedBudget.periodType
        this.updateItem(this.myBudget, now, this.account.startdate)
      },
      async newTransaction(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/budgets/${this.budget._id}/transactions/`, transactionToAdd);
        this.myBudget.transactions.push(response.data.addedTransaction)
        this.$emit("budgetUpdated", this.myBudget)
        //console.log(response)
      },
      async removeTransaction(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/budgets/${this.budget._id}/transactions/${transactionToRemove._id}`);
        console.log(response)
        this.myBudget = this.myBudget.filter((transaction) => {
          return response.data.removedTransactionId != transaction._id
        })

        this.$emit("budgetUpdated", this.myBudget)
      },
      async editTransaction(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/budgets/${this.budget._id}/transactions/${editedTransactionId}`, editedTransaction);
        console.log(response)
        this.$emit("budgetUpdated", this.myBudget)
      },
      async newSettlement(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/`, transactionToAdd);
        this.myBudget.transactions.push(response.data.addedTransaction)
        this.$emit("budgetUpdated", this.myBudget)
        //console.log(response)
      },
      async removeSettlement(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/${transactionToRemove._id}`);
        console.log(response)
        this.$emit("budgetUpdated", this.myBudget)
      },
      async editSettlement(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/${editedTransactionId}`, editedTransaction);
        console.log(response)
        this.$emit("budgetUpdated", this.myBudget)
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
      dueIn: function() {

        var d = Math.floor(this.myBudget.dueIn / (3600*24));
        var h = Math.floor(this.myBudget.dueIn % (3600*24) / 3600);
        // var m = Math.floor(this.myRecurring.dueIn % 3600 / 60);
        // var s = Math.floor(this.myRecurring.dueIn % 60);

        var dDisplay = d > 0 ? d + (d == 1 ? " d " : " d ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " h" : " h") : "";
        // var mDisplay = m > 0 ? m + (m == 1 ? ":" : ":") : "";
        // var sDisplay = s > 0 ? s + (s == 1 ? "" : "") : "";
        return dDisplay + hDisplay
        
      }
    },
    watch: {
      budget: function (newVal) {
        this.myBudget = newVal
      }
    }
  };
  
</script>

