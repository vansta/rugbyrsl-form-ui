import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

import apiService from '../src/services/ApiService'

Vue.prototype.$api = apiService

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
