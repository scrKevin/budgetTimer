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
          v-model="recurring.title"
        />
        <input
          type="amount"
          step=".01"
          placeholder="amount"
          v-model="recurring.amount"
        />
        <input
          type="datetime-local"
          v-model="recurring.startdate"
        />
        <input
          type="checkbox"
          v-model="recurring.ended"
        />
        <input
          type="datetime-local"
          v-model="recurring.enddate"
        />
        <input
          type="period"
          step="1"
          placeholder="period"
          v-model="recurring.period"
        />
        <select v-model="recurring.periodType">
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
    name: 'recurring-form',
    mixins: [DateConverter],
    components: {
      Modal,
    },
    props: ["new", "toEdit", "accountId"],
    data() {
      if (this.toEdit) {
        return {
          isModalVisible: false,
          recurring: {
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
          recurring: {
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
          return 'newRecurringModal'
        }
      },
      typeString: function() {
        if (this.toEdit) {
          return "Edit"
        }
        else {
          return "Add Recurring"
        }
      },
      headerText: function() {
        if (this.toEdit) {
          return "Edit Recurring"
        }
        else {
          return "New Recurring"
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
          let response = await this.$http.post(`/user/account/${this.accountId}/recurring`, this.recurring);
          console.log(response)
          // //this.closeModal()
          this.$emit("newRecurring", response.data.addedRecurring)
        } else {
          // let response = await this.$http.put(`/user/account/${this.toEdit._id}`, this.account);
          // //console.log(response)
          this.$emit("editedRecurring", this.recurring)
        }
        
        this.isModalVisible = false;
      }
    }
  };
</script>