import Vue from 'vue'
import VueRouter from 'vue-router'

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}



Vue.use(VueRouter);

import menuModule from './modules/menuModule';
import OtherRouters from './modules/allOtherRouter';
//导入store
import store from '@/store';

const routes = [
  ...menuModule,
  ...OtherRouters,
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    children: [
      {
        path: '/index/',
        redirect: '/index/commend'
      },
      // 子路由不加 /
      { path: 'commend', name: 'commend',       component: () => import('views/index/indexChildren/commend/commend.vue') },
      { path: 'music_list', name: 'music_list', component: () => import('views/index/indexChildren/music_list/music_list.vue') },
      { path: 'singer', name: 'singer',         component: () => import('views/index/indexChildren/singer/singer.vue') },
      { path: 'rank', name: 'rank',             component: () => import('views/index/indexChildren/rank/rank.vue') },
      { path: 'latest', name: 'latest',         component: () => import('views/index/indexChildren/latest/latest.vue') },
    ],
    component: () => import('views/index/index.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 全局跳转页面回到顶部
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})

export default router
