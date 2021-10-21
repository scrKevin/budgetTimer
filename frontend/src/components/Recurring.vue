<template>
  <!-- <li>
    <span>
      {{ (this.myRecurring.velocity * (60*60)).toFixed(6) }} €/h {{ this.myRecurring.title }} ({{ this.myRecurring.amount }} per {{ this.myRecurring.period }} {{ this.myRecurring.periodType }}) due in: {{ this.dueIn }}, balance: {{ this.myRecurring.recurringBalance.toFixed(2) }}
      <RecurringForm v-bind:new="false" v-bind:toEdit="this.recurring" @editedRecurring='editRecurring'></RecurringForm>
      <b-button variant="danger" @click="deleteThisRecurring">
        ×
      </b-button>
      <TransactionList 
        :parentId="recurring._id"
        :type="this.transactionType"
        :transactionList="recurring.transactions"
        @newTransaction='newTransaction'
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
      </TransactionList>
      <TransactionList 
        :parentId="recurring._id"
        :type="this.settlementType"
        :transactionList="recurring.settlements"
        @newTransaction='newSettlement'
        @removeTransaction="removeSettlement"
        @editedTransaction="editSettlement"
      >
      </TransactionList>
    </span>
  </li> -->
  <div class="row">
    <div class="col-xs-3 col-md-1">{{ (this.myRecurring.velocity * (60*60)).toFixed(6) }}</div>
    <div class="col-xs-5 col-md-3">{{ this.myRecurring.title }} ({{ this.myRecurring.amount }} per {{ this.myRecurring.period }} {{ this.myRecurring.periodType }})</div>
    <div class="col-xs-4 col-md-1">{{ this.dueIn }}</div>
    <div class="col-xs-2 col-md-1">{{ this.myRecurring.recurringBalance.toFixed(2) }}</div>
    <div class="col-xs-2 col-md-1"><RecurringForm v-bind:new="false" v-bind:toEdit="this.recurring" @editedRecurring='editRecurring'></RecurringForm></div>
    <div class="col-xs-2 col-md-1"><b-button variant="danger" @click="deleteThisRecurring">
        ×
      </b-button></div>
    <div class="col-xs-3 col-md-2">
      <TransactionForm 
        v-bind:new="true"
        :type="this.transactionType"
        v-bind:parentId="recurring._id"
        @newTransaction='newTransaction'
      > 
      </TransactionForm>
      <input class="form-check-input" type="checkbox" v-model="transactionsVisible" style="margin: 9px;">
    </div>
    <div class="col-xs-3 col-md-2">
      <TransactionForm 
        v-bind:new="true"
        :type="this.settlementType"
        v-bind:parentId="recurring._id"
        @newTransaction='newSettlement'
      > 
      </TransactionForm>
      <input class=" form-check-input" type="checkbox" v-model="settlementsVisible" style="margin: 9px;">
    </div>
    <div class="col-xs-12" v-if="transactionsVisible">
      <h4>Transactions:</h4>
      <TransactionList 
        :parentId="recurring._id"
        :type="this.transactionType"
        :transactionList="recurring.transactions"
        @removeTransaction="removeTransaction"
        @editedTransaction="editTransaction"
      >
      </TransactionList>
    </div>
    <div class="col-xs-12" v-if="settlementsVisible">
      <h4>Settlements:</h4>
      <TransactionList 
        :parentId="recurring._id"
        :type="this.settlementType"
        :transactionList="recurring.settlements"
        @removeTransaction="removeSettlement"
        @editedTransaction="editSettlement"
      >
      </TransactionList>
    </div>
  </div>
</template>

<script>
  import RecurringForm from "./RecurringForm.vue"
  import TransactionList from "./TransactionList.vue"
  import TransactionForm from '../components/TransactionForm.vue'
  import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
  export default {
    props: ["recurring", "account"],
    mixins: [RecurringBudgetsMethods],
    components: {
      RecurringForm,
      TransactionList,
      TransactionForm
    },
    data() {
      return {
        myRecurring: this.recurring,
        transactionType: "transaction",
        settlementType: "settlement",
        transactionsVisible: false,
        settlementsVisible: false
      }
      
    },
    methods: {
      deleteThisRecurring () {
        if(confirm("Do you really want to delete " + this.myRecurring.title + "?")){
          this.$emit("removeRecurring", this.myRecurring)
        }
      },
      editRecurring (editedRecurring) {
        var now = new Date()
        this.$emit("editedRecurring", this.myRecurring._id, editedRecurring)
        this.myRecurring.title = editedRecurring.title
        this.myRecurring.amount = editedRecurring.amount
        this.myRecurring.startdate = editedRecurring.startdate
        this.myRecurring.ended = editedRecurring.ended
        this.myRecurring.enddate = editedRecurring.enddate
        this.myRecurring.period = editedRecurring.period
        this.myRecurring.periodType = editedRecurring.periodType
        this.updateItem(this.myRecurring, now, this.account.startdate)
      },
      async newTransaction(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/recurring/${this.recurring._id}/transactions/`, transactionToAdd);
        this.myRecurring.transactions.push(response.data.addedTransaction)
        //console.log(response)
      },
      async removeTransaction(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/recurring/${this.recurring._id}/transactions/${transactionToRemove._id}`);
        console.log(response)
      },
      async editTransaction(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/recurring/${this.recurring._id}/transactions/${editedTransactionId}`, editedTransaction);
        console.log(response)
      },
      async newSettlement(transactionToAdd) {
        let response = await this.$http.post(`/user/account/${this.account._id}/recurring/${this.recurring._id}/settlements/`, transactionToAdd);
        this.myRecurring.transactions.push(response.data.addedTransaction)
        //console.log(response)
      },
      async removeSettlement(transactionToRemove) {
        let response = await this.$http.delete(`/user/account/${this.account._id}/recurring/${this.recurring._id}/settlements/${transactionToRemove._id}`);
        console.log(response)
      },
      async editSettlement(editedTransactionId, editedTransaction) {
        let response = await this.$http.put(`/user/account/${this.account._id}/recurring/${this.recurring._id}/settlements/${editedTransactionId}`, editedTransaction);
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
      dueIn: function() {

        var d = Math.floor(this.myRecurring.dueIn / (3600*24));
        var h = Math.floor(this.myRecurring.dueIn % (3600*24) / 3600);
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
      recurring: function (newVal) {
        this.myRecurring = newVal
      }
    }
  };
  
</script>

