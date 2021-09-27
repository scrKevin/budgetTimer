import Vue from 'vue';
import Router from 'vue-router';
import Recurring from './views/Recurring.vue';
import New from './views/New.vue';
import Show from './views/Show.vue';
import Edit from './views/Edit.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/recurring'
    },
    {
      path: '/recurring',
      name: 'recurring',
      component: Recurring
    },
    {
      path: '/recurring/new',
      name: 'new-recurring',
      component: New
    },
    {
      path: '/recurring/:id',
      name: 'show',
      component: Show
    },
    {
      path: '/recurring/:id/edit',
      name: 'edit',
      component: Edit
    }
   
  ]
});