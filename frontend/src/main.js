import Vue from 'vue'
import App from './App.vue'

import 'semantic-ui-css/semantic.css';
import router from './Router'
import axios from "axios";
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm'
import "bootstrap/dist/css/bootstrap.css";
import 'bootstrap-vue/dist/bootstrap-vue';


var backEnd_URL = "http://localhost:5000/api";
if (process.env.NODE_ENV == "production") {
  backEnd_URL = "https://budget.bitwiseworkshop.nl/api"  
}

const base = axios.create({
  baseURL: backEnd_URL
});

base.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt');
    const auth = token ? `Bearer ${token}` : '';
    config.headers.common['Authorization'] = auth;
    return config;
  },
  error => Promise.reject(error),
);

Vue.prototype.$http = base;

Vue.use(BootstrapVue)


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')