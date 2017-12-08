import Vue          from 'vue'
import App          from './App.vue'
import VueRouter    from 'vue-router'
import router       from './router'
import VueSocketIO  from "vue-socket-io";

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon.vue'

Vue.use(VueRouter)
Vue.use(VueSocketIO, "http://localhost:3008");
Vue.component('icon', Icon)


new Vue({
  el: '#app',
  render: h => h(App),
  router
})
