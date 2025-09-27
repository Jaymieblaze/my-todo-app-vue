import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import AuthPage from '../views/AuthPage.vue';
import TodosPage from '../views/TodosPage.vue';
import TodoDetailPage from '../views/TodoDetailPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: AuthPage,
      alias: '/login'
    },
    {
      path: '/todos',
      name: 'todos',
      component: TodosPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/todos/:todoId',
      name: 'todo-detail',
      component: TodoDetailPage,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Wait for initial auth state (if not already loaded)
  if (authStore.loading) {
    await authStore.init();
  }

  const isAuthenticated = !!authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'auth' });
  } else if (to.name === 'auth' && isAuthenticated) {
    next({ name: 'todos' });
  } else {
    next();
  }
});

export default router;

