<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
        <form
          class="text-center border border-primary p-5"
          style="margin-top:70px;height:auto;padding-top:100px !important;"
          @submit.prevent="registerUser"
        >
          <input
            type="email"
            id="emailAddress"
            class="form-control mb-5"
            placeholder="Email"
            v-model="register.emailAddress"
            required
          />
          <!-- Password -->
          <input
            type="password"
            id="password"
            class="form-control mb-5"
            placeholder="Password"
            v-model="register.password"
          />
          <p>
            Already have an account??<router-link to="/"
              >click here</router-link
            >
            <!-- Sign in button -->
            <center>
              <button class="btn btn-primary btn-block w-75 my-4" type="submit">
                Sign in
              </button>
            </center>
          </p>
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
      register: {
        emailAddress: "",
        password: ""
      }
    };
  },
  methods: {
    async registerUser() {
      try {
        let response = await this.$http.post("/user", this.register);
        console.log(response);
        let token = response.data.token;
        if (token) {
          localStorage.setItem("jwt", token);
          this.$router.push("/home");
          this.flash("Registration Was successful", "success");
        } else {
          this.flash("Something Went Wrong", "error");
        }
      } catch (err) {
        console.log(err)
        let error = err.response;
        if (error.status == 409) {
          this.flash(error.data.message, "error");
        } else {
          this.flash(error.data.err.message, "error");
        }
      }
    }
  }
};
</script>