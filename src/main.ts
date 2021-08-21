import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import global_v from './global.js'
import {MessageType} from "@/utils/Types";

Vue.config.productionTip = false

Vue.prototype.GLOBAL = global_v
Vue.prototype.MessageType = MessageType

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
