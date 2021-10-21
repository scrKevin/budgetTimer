<template>
  <!-- <li>
    <span>
      {{ getDateString }} {{ transaction.title }} {{ transaction.amount }}
      <TransactionForm v-bind:new="false" v-bind:toEdit="this.transaction" @editedTransaction='editTransaction'></TransactionForm>
      <b-button variant="danger" @click="deleteThisTransaction">
        ×
      </b-button>
    </span>
  </li> -->
  <div class="row">
    <div class="col-xs-3 col-md-1"></div>
    <div class="col-xs-4 col-md-2">{{ getDateString }}</div>
    <div class="col-xs-5 col-md-2">{{ transaction.title }}</div>
    <div class="col-xs-2 col-md-1">{{ transaction.amount }}</div>
    <div class="col-xs-2 col-md-1"><TransactionForm v-bind:new="false" v-bind:toEdit="this.transaction" @editedTransaction='editTransaction'></TransactionForm></div>
    <div class="col-xs-2 col-md-1"><b-button variant="danger" @click="deleteThisTransaction">
        ×
      </b-button></div>
    <div class="col-xs-3 col-md-2"></div>
    <div class="col-xs-3 col-md-2"></div>
    </div>
</template>

<script>
  import TransactionForm from "./TransactionForm.vue"
  export default {
    props: ["transaction"],
    components: {
      TransactionForm,
    },
    data() {
      return {
        myTransaction: this.transaction,
      }
      
    },
    methods: {
      deleteThisTransaction () {
        if(confirm("Do you really want to delete " + this.myTransaction.title + "?")){
          this.$emit("removeTransaction", this.myTransaction)
        }
      },
      editTransaction (editedTransaction) {
        this.$emit("editedTransaction", this.myTransaction._id, editedTransaction)
        this.myTransaction.title = editedTransaction.title
        this.myTransaction.amount = editedTransaction.amount
        this.myTransaction.date = editedTransaction.date
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
      getDateString: function() {
        return new Date(this.transaction.date).toLocaleString("NL-nl")
      }
    },
    watch: {
      transaction: function (newVal) {
        this.myTransaction = newVal
      }
    }
  };
  
</script>

