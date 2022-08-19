import ActorsListView from '@/views/ActorsListView.vue';
import CompaniesListView from '@/views/CompaniesListView.vue';
import { createRouter, createWebHistory } from 'vue-router';
import MoviesListView from '@/views/MoviesListView.vue';
import PageNotFoundView from '@/views/PageNotFoundView.vue';
import MovieDetailView from '@/views/MovieDetailView.vue';
import MovieEditView from '@/views/MovieEditView.vue';
import { useAlertStore } from '@/stores/alert';
import MovieCreationComponent from '@/components/MovieCreationComponent.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/movies'
    },
    {
      path: '/movies',
      name: 'movies',
      component: MoviesListView
    },
    {
      path: '/movies/:id',
      name: 'movie-detail',
      component: MovieDetailView
    },
    {
      path: '/movies/edit/:id',
      name: 'movie-edit',
      component: MovieEditView
    },
    {
      path: '/movies/create',
      name: 'movie-create',
      component: MovieCreationComponent
    },
    {
      path: '/actors',
      name: 'actors',
      component: ActorsListView
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompaniesListView
    },
    {
      path: '/:catchAll(.*)*',
      name: "PageNotFound",
      component: PageNotFoundView,
    },
    // catch all redirect to home page
    { path: '/:pathMatch(.*)*', redirect: '/' }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
});

router.beforeEach(async (to) => {
  // clear alert on route change
  const alertStore = useAlertStore();
  alertStore.clear();

  // redirect to login page if not logged in and trying to access a restricted page
  // const publicPages = ['/account/login', '/account/register'];
  // const authRequired = !publicPages.includes(to.path);
  // const authStore = useAuthStore();

  // if (authRequired && !authStore.user) {
  //   authStore.returnUrl = to.fullPath;
  //   return '/account/login';
  // }
});

export default router
