import { createRouter, createWebHistory } from 'vue-router'
import FamilymartPage from '../views/FamilymartPage.vue'
import SevenPage from '@/views/SevenPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/familymart/:latlng?',
      name: 'familymart',
      component: FamilymartPage
    },
    {
      path: '/7-11/:latlng?',
      name: '7-11',
      component: SevenPage
    },
    {
      path: '/',
      redirect: '/familymart'
    }
  ]
})

export default router
