 <template>
  <!-- <span> -->
    <!-- <TransactionForm 
      v-bind:new="true"
      :type="this.type"
      v-bind:parentId="parentId"
      @newTransaction='addTransaction'
    > 
    </TransactionForm> -->
    <!-- <ul>
      <Transaction
        v-for="transaction in myTransactionList"
        v-bind:key="transaction._id"
        :transaction="transaction"
        @removeTransaction='removeTransaction'
        @editedTransaction='editTransaction'
      />
    </ul> -->
  <!-- </span> -->
  <div class="container grid-striped">
      <Transaction
        v-for="transaction in sortedTransactionList"
        v-bind:key="transaction._id"
        :transaction="transaction"
        @removeTransaction='removeTransaction'
        @editedTransaction='editTransaction'
      />
  </div>
</template>

<script>

// import TransactionForm from '../components/TransactionForm.vue'
import Transaction from '../components/Transaction.vue'
export default {
  name: 'transactionList',
  components: {
    // TransactionForm,
    Transaction
  },
  props: ["transactionList", "parentId", "type"],
  data() {
    return {
      myTransactionList: this.transactionList
    };
  },
  methods: {
    addTransaction(newTransaction) {
      this.$emit("newTransaction", newTransaction)
      //this.myTransactionList.push(newTransaction)
    },
    async removeTransaction (transactionToRemove) {
      console.log(transactionToRemove)
      //let response = await this.$http.delete(`/user/account/${this.accountId}/recurring/${recurringToRemove._id}`);
      this.$emit("removeTransaction", transactionToRemove)
      this.myTransactionList = this.myTransactionList.filter((transaction) => {
        return transactionToRemove._id != transaction._id
      })
    },
    async editTransaction (editedTransactionId, editedTransaction) {
      //console.log(editedTransactionId)
      //console.log(editedTransaction)
      this.$emit("editedTransaction", editedTransactionId, editedTransaction)
      //await this.$http.put(`/user/account/${this.accountId}/recurring/${editedRecurringId}`, editedRecurring);
    }
  },
  computed: {
    sortedTransactionList: function() {
      return myTransactionList.sort((a,b)=>b.date.getTime()-a.date.getTime());
    }
  },
  watch: {
    transactionList: function(newVal) {
      this.myTransactionList = newVal
    }
  },
  mounted() {
    //console.log(this.accountList)
  }
};
</script>

<style scoped>
.grid-striped .row:nth-of-type(odd) {
    background-color: rgba(0,0,0,.05);
}

.row {
    padding:5px;
}
</style>