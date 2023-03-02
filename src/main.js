import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css';

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;
Vue.use(Antd);
import 'element-ui/lib/theme-chalk/index.css';

import Vuelazyload from 'vue-lazyload';
//安装懒加载
Vue.use(Vuelazyload, {
  loading: require('./assets/images/load.png')
})

// 事件总线
Vue.prototype.$bus = new Vue();

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
