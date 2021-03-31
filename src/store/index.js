import Vue from 'vue'
import Vuex from 'vuex'

import play_list from './modules/play_list';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  getters: {

  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  modules: {
    playListModule: play_list,
    userModule: user
  }
})
