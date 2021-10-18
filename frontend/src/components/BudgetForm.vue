<template>
  <span id="account-form">
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
          v-model="budget.title"
        />
        <input
          type="amount"
          step=".01"
          placeholder="amount"
          v-model="budget.amount"
        />
        <input
          type="datetime-local"
          v-model="budget.startdate"
        />
        <input
          type="checkbox"
          v-model="budget.ended"
        />
        <input
          type="datetime-local"
          v-model="budget.enddate"
        />
        <input
          type="period"
          step="1"
          placeholder="period"
          v-model="budget.period"
        />
        <select v-model="budget.periodType">
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
          <option value="year">Year</option>
        </select>
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
    name: 'budget-form',
    mixins: [DateConverter],
    components: {
      Modal,
    },
    props: ["new", "toEdit", "accountId"],
    data() {
      if (this.toEdit) {
        return {
          isModalVisible: false,
          budget: {
            title: this.toEdit.title,
            amount: this.toEdit.amount,
            startdate: this.formatDate(this.toEdit.startdate),
            ended: this.toEdit.ended,
            enddate: this.formatDate(this.toEdit.enddate),
            period: this.toEdit.period,
            periodType: this.toEdit.periodType
          }
        };
      }
      else {
        return {
          isModalVisible: false,
          budget: {
            title: "",
            amount: 0,
            startdate: null,
            ended: false,
            enddate: null,
            period: 1,
            periodType: "day"
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
          return 'newBudgetModal'
        }
      },
      typeString: function() {
        if (this.toEdit) {
          return "Edit"
        }
        else {
          return "Add Budget"
        }
      },
      headerText: function() {
        if (this.toEdit) {
          return "Edit Budget"
        }
        else {
          return "New Budget"
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
          let response = await this.$http.post(`/user/account/${this.accountId}/budgets`, this.budget);
          console.log(response)
          // //this.closeModal()
          this.$emit("newBudget", response.data.addedBudget)
        } else {
          // let response = await this.$http.put(`/user/account/${this.toEdit._id}`, this.account);
          // //console.log(response)
          this.$emit("editedBudget", this.budget)
        }
        
        this.isModalVisible = false;
      }
    }
  };
</script>