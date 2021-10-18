<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item @click='logUserOut()'>Log out</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <span>
  <AccountList v-bind:accountList="this.user.accounts"></AccountList>
  </span>
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
  },
  created() {
    this.getUserDetails();
  },
  mounted() {

    
  }
};
</script>
<style scoped></style>