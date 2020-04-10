import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import VueSocketIO from 'vue-socket.io'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

axios.defaults.baseURL = 'http://localhost:4040'

Vue.config.productionTip = false

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: 'http://localhost:5005',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  })
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
