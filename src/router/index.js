import Vue from 'vue'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'

Vue.use(VueRouter)
Vue.use(Meta)

const routes = [
  {
    path: '*',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      header: true
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem("loged")) next({ name: 'Home' })
      next()
    },
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0, behavior: 'smooth', };
  },
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !localStorage.getItem("loged")) next({ name: 'Login' })
  next()
})

export default router
