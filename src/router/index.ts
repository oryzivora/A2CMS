import { createRouter, createWebHistory } from 'vue-router'
import Characters from '@/views/Characters.vue'

const routes = [
  { path: '/', name: 'Characters', component: Characters },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
