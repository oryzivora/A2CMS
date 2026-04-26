import { createRouter, createWebHistory } from 'vue-router'
import Characters from '@/views/Characters.vue'
import Help from '@/views/Help.vue'

const routes = [
  { path: '/', name: 'Characters', component: Characters },
  { path: '/help', name: 'Help', component: Help },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
