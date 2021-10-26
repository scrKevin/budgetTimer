<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item @click='exportAccounts()'>Export Accounts</b-nav-item>
        <b-nav-item @click='logUserOut()'>Log out</b-nav-item>          
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <span>
  <AccountList v-bind:accountList="this.user.accounts"></AccountList>
  </span>
  <input type="file" id="selectFiles" value="Import" /><br />
  <button @click="importAccounts" id="import">Import Accounts</button>
</div>
</template>

<script>

import VueJwtDecode from "vue-jwt-decode";
import AccountList from "../components/AccountList.vue"
import RecurringBudgetsMethods from "../helpers/recurringBudgetsMethods"
export default {
  mixins: [RecurringBudgetsMethods],
  components: {
    AccountList
  },
  data() {
    return {
      token: "",
      userData: {},
      user: {accounts:[]},
      appStartdate: new Date(Date.parse("2021-09-15T00:00:00"))
    };
  },
  methods: {
    async getUserDetails() {
      this.token = localStorage.getItem("jwt");
      let decoded = VueJwtDecode.decode(this.token);
      this.userData = decoded;
      let response = await this.$http.get(`/user/${this.userData._id}`)
      this.calcComputedProperties(response.data)
      this.user = response.data
    },
    async logUserOut() {
      await this.$http.post("/user/me/logout", {_id: this.user._id, token: this.token})
      localStorage.removeItem("jwt");
      this.$router.push("/");
    },
    async exportAccounts() {
      let response = await this.$http.get(`/user/${this.userData._id}`)
      const data = JSON.stringify(response.data.accounts)
      const blob = new Blob([data], {type: 'text/plain'})
      const e = document.createEvent('MouseEvents'),
      a = document.createElement('a');
      a.download = `budgetTimer_accounts_backup.json`;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
      e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      a.dispatchEvent(e);
    },
    async importAccounts() {
      const files = document.getElementById('selectFiles').files;
      if (files.length <= 0) {
        return false;
      }

      const fr = new FileReader();

      fr.onload = async (e) => {
        const result = JSON.parse(e.target.result);
        //console.log(result)
        var response = await this.$http.post(`/user/${this.user._id}/import-accounts`, result)
        if (response.data.message == "success") {
          alert("Success")
        } else {
          alert("Fail")
        }
      }
      fr.readAsText(files.item(0));
    }
  },
  created() {
    this.getUserDetails();
  },
  mounted() {

    
  }
};
</script>
<style scoped></style>