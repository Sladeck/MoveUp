import VueRouter from 'vue-router'
import HomeView  from './views/Home.vue'

const routes = [
  {path: '/', component: HomeView }
];

const router = new VueRouter({
   routes
});

export default router
