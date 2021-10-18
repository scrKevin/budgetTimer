<template>
  <span id="transaction-form">
    <b-button @click="isModalVisible = !isModalVisible">{{ typeString }}</b-button>

    <Modal
      v-bind:id="this.modalId"
      v-bind:isModalVisible="isModalVisible"
      @close="closeModal"
    >
      <template v-slot:header>
        {{ headerText }}
      </template>

      <template v-slot:body>
        <form className="new-account" @submit.prevent="handleSubmit">
        <input
          type="text"
          placeholder="title"
          v-model="transaction.title"
        />
        <input
          type="amount"
          step=".01"
          placeholder="amount"
          v-model="transaction.amount"
        />
        <input
          type="datetime-local"
          v-model="transaction.date"
        />
        <button type="submit">Save</button>
        </form>
      <!-- </template>

      <template v-slot:footer> -->
        
      </template>
    </Modal>
  </span>
</template>

<script>
  import Modal from './Modal.vue';
  import DateConverter from '../helpers/dateConverter'

  export default {
    name: 'transaction-form',
    mixins: [DateConverter],
    components: {
      Modal,
    },
    props: ["new", "toEdit", "parentId", "type"],
    data() {
      if (this.toEdit) {
        return {
          isModalVisible: false,
          transaction: {
            title: this.toEdit.title,
            amount: this.toEdit.amount,
            date: this.formatDate(this.toEdit.date),
          }
        };
      }
      else {
        return {
          isModalVisible: false,
          transaction: {
            title: "",
            amount: 0,
            date: null,
          }
        };
      }
      
    },
    computed: {
      modalId: function() {
        if (this.toEdit) {
          return this.toEdit._id
        }
        else {
          return `newTransactionModal_${this.parentId}`
        }
      },
      typeString: function() {
        if (this.toEdit) {
          return "Edit"
        }
        else {
          if (this.type == "transaction") {
            return "Add Transaction"
          } else if (this.type == "settlement") {
            return "Add Settlement"
          } else if (this.type == "reservation") {
            return "Add Reservation"
          }
          return "Add"
        }
      },
      headerText: function() {
        if (this.toEdit) {
          return "Edit Transaction"
        }
        else {
          return "New Transaction"
        }
      }
    },
    methods: {
      showModal() {
        this.isModalVisible = true;
      },
      closeModal() {
        this.isModalVisible = false;
      },
      async handleSubmit() {
        
        if (this.new) {
          //let response = await this.$http.post(`/user/account/${this.accountId}/recurring`, this.recurring);
          //console.log(response)
          // //this.closeModal()
          this.$emit("newTransaction", this.transaction)
        } else {
          // let response = await this.$http.put(`/user/account/${this.toEdit._id}`, this.account);
          // //console.log(response)
          this.$emit("editedTransaction", this.transaction)
        }
        
        this.isModalVisible = false;
      }
    }
  };
</script>