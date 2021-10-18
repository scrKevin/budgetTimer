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
          placeholder="name"
          v-model="account.name"
        />
        <input
          type="datetime-local"
          v-model="account.startdate"
        />
        <input
          type="number"
          step=".01"
          placeholder="startbalance"
          v-model="account.startbalance"
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
    name: 'account-form',
    mixins: [DateConverter],
    components: {
      Modal,
    },
    props: ["new", "toEdit"],
    data() {
      if (this.toEdit) {
        return {
          isModalVisible: false,
          account: {
            name: this.toEdit.name,
            startdate: this.formatDate(this.toEdit.startdate),
            startbalance: this.toEdit.startbalance,
          }
        };
      }
      else {
        return {
          isModalVisible: false,
          account: {
            name: "",
            startdate: null,
            startbalance: 0            
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
          return 'newAccountModal'
        }
      },
      typeString: function() {
        if (this.toEdit) {
          return "Edit"
        }
        else {
          return "Add Account"
        }
      },
      headerText: function() {
        if (this.toEdit) {
          return "Edit Account"
        }
        else {
          return "New Account"
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
          let response = await this.$http.post("/user/account", this.account);
          //this.closeModal()
          this.$emit("newAccount", response.data.addedAccount)
        }
        else {
          let response = await this.$http.put(`/user/account/${this.toEdit._id}`, this.account);
          //console.log(response)
          this.$emit("editedAccount", response.data.editedAccountId, this.account)
        }
        
        this.isModalVisible = false;
      }
    }
  };
</script>