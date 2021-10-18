<template>
  <li>
    <span>
      {{ transaction.title }} {{ transaction.amount }}
      <TransactionForm v-bind:new="false" v-bind:toEdit="this.transaction" @editedTransaction='editTransaction'></TransactionForm>
      <b-button variant="danger" @click="deleteThisTransaction">
        ×
      </b-button>
    </span>
  </li>
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
    },
    watch: {
      transaction: function (newVal) {
        this.myTransaction = newVal
      }
    }
  };
  
</script>

