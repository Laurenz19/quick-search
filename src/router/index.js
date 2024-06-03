import { createRouter, createWebHistory} from 'vue-router';
import LoginView from '@Views/LoginView.vue';
import QuickSearchView from '@Views/QuickSearchView.vue';
import DataSearchView from '@Views/DataSearchView.vue';
import Global from '@Views/GlobalView.vue';
const removeAccess = (to, from, next) => {
  localStorage.removeItem("user_authenticated");
  localStorage.removeItem("access");
  localStorage.removeItem("user");
  localStorage.removeItem("user_role");
  next();
}

const CheckAccess = (to, from, next) => {
  if(localStorage.getItem("access") == null) next('/');
  else next();
}

const CheckAuthentication = (to, from, next) => {
    if(to.name == 'Login' && localStorage.getItem("access") == null){
      next()
    } else next('/home')
}

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView, 
    beforeEnter:[CheckAuthentication, removeAccess],
  },
  {
    path: '/home',
    name: 'Home',
    component: ()=> import('@Views/HomeView.vue'),
    beforeEnter: [CheckAccess],
  },
   {
    path: '/explore-data-temp',
    name: 'SearchTemp',
    component: QuickSearchView,
    beforeEnter: [CheckAccess],
  },
  {
    path: '/explore-data',
    component: DataSearchView,
    beforeEnter: [CheckAccess],
    children: [
      {
        path: '',
        name: 'Global',
        component: Global
      },
      {
        path: 'occupancy-rate',
        name: 'Occupancy',
        component: ()=> import('@Views/OccupancyRateView.vue')
      },
      {
        path: 'night',
        name: 'Night',
        component: ()=> import('@Views/NightView.vue')
      },
      {
        path: 'stocks',
        name: 'Stocks',
        component: ()=> import('@Views/StocksView.vue')
      }
    ]
  },
   {
    path: '/analysis',
    name: 'AnalysisComparison',
    component: ()=> import('@Views/AnalysisComparisonView.vue'),
    beforeEnter: [CheckAccess],
  },
  {
    path:'/:catchAll(.*)',
    name: 'NotFound',
    component: ()=> import('@Views/NotFoundView.vue'),
  }
]

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHistory(),
  routes
})

export default router
