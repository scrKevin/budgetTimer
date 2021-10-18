import Vue from 'vue';
import Router from 'vue-router';
import VueJwtDecode from "vue-jwt-decode";
// import HelloWorld from './components/HelloWorld.vue';
// import New from './views/New.vue';
// import Show from './views/Show.vue';
// import Edit from './views/Edit.vue';

import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './views/Home.vue'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        requiresAuth: true
      },
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
});


function checkTokenValidity(token) {
  if (token) {
    const decodedToken = VueJwtDecode.decode(token)
    return decodedToken && (decodedToken.exp * 1000) > new Date().getTime()
  
  }
  return false
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/"
      });
    } else {
      if (!checkTokenValidity(localStorage.getItem("jwt"))) {
        next({
          path: "/"
        });
      } else {
        next();
      }
    }
  } else {
    next();
  }
});

export default router;