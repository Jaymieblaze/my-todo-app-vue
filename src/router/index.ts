import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthPage from '../views/AuthPage.vue';
import TodosPage from '../views/TodosPage.vue';
import TodoDetailPage from '../views/TodoDetailPage.vue';
import NotFoundPage from '../views/NotFoundPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: AuthPage },
    { path: '/todos', name: 'todos', component: TodosPage, meta: { requiresAuth: true } },
    { path: '/todos/:todoId', name: 'todoDetail', component: TodoDetailPage, meta: { requiresAuth: true } },
    { path: '/', redirect: '/todos' },
    { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundPage },
  ],
});

// This navigation guard now runs on every navigation *after* the initial app load.
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !authStore.user) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;

