<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center border border-primary p-5"
          style="margin-top:70px;height:auto;padding-top:100px !important;"
          @submit.prevent="loginUser"
        >
          <input
            type="text"
            id="emailAddress"
            class="form-control mb-5"
            placeholder="Email"
            v-model="login.emailAddress"
          />
          <!-- Password -->
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="login.password"
          />
          <p>
            Dont have an account??<router-link to="/register"
              >click here</router-link
            >
          </p>
          <!-- Sign in button -->
          <center>
            <button class="btn btn-primary btn-block w-75 my-4" type="submit">
              Sign in
            </button>
          </center>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { api } from '../helpers/helpers';
export default {
  data() {
    return {
      login: {
        emailAddress: "",
        password: ""
      }
    };
  },
  methods: {
    async loginUser() {
      try {
        let response = await this.$http.post("/user/login", this.login);
        let token = response.data.token;
        localStorage.setItem("jwt", token);
        if (token) {
          this.flash("Login Successful", "success");
          this.$router.push("/home");
        }
      } catch (err) {
        this.flash("Something Went Wrong", "error");
        console.log(err.response);
      }
    }
  }
};
</script>