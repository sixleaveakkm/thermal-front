import {Alert, Col, Row} from 'view-design'
import 'view-design/dist/styles/iview.css';
import Vue from 'vue'
import App from './App.vue'

Vue.component('Alert', Alert)
Vue.component('Col', Col)
Vue.component('Row', Row)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
