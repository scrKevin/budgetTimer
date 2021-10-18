<template>
  <li>
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
  </li>
</template>

<script>
  import BudgetForm from "./BudgetForm.vue"
  import TransactionList from "./TransactionList.vue"
  import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
  export default {
    props: ["budget", "account"],
    mixins: [RecurringBudgetsMethods],
    components: {
      BudgetForm,
      TransactionList
    },
    data() {
      return {
        myBudget: this.budget,
        transactionType: "transaction",
        settlementType: "settlement"
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
        //console.log(response)
      },
      async removeTransaction(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/budgets/${this.budget._id}/transactions/${transactionToRemove._id}`);
        console.log(response)
      },
      async editTransaction(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/budgets/${this.budget._id}/transactions/${editedTransactionId}`, editedTransaction);
        console.log(response)
      },
      async newSettlement(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/`, transactionToAdd);
        this.myBudget.transactions.push(response.data.addedTransaction)
        //console.log(response)
      },
      async removeSettlement(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/${transactionToRemove._id}`);
        console.log(response)
      },
      async editSettlement(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/budgets/${this.budget._id}/settlements/${editedTransactionId}`, editedTransaction);
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
    },
    watch: {
      budget: function (newVal) {
        this.myBudget = newVal
      }
    }
  };
  
</script>

