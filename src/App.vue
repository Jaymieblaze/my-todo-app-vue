<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useThemeStore } from './stores/theme';
import { signOut, getRedirectResult, getAdditionalUserInfo, User } from 'firebase/auth';
import { auth } from './firebase';
import { addMultipleTodosToFirestore } from './utils/api';
import type { Todo } from './utils/db';
import Button from './components/Button.vue';
import SunIcon from './components/icons/SunIcon.vue';
import MoonIcon from './components/icons/MoonIcon.vue';
import LoaderSpin from './components/icons/LoaderSpin.vue';

const authStore = useAuthStore();
const themeStore = useThemeStore();
const route = useRoute();
const router = useRouter();

const isMenuOpen = ref(false);

onMounted(async () => {
  authStore.init();
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const additionalInfo = getAdditionalUserInfo(result);
      if (additionalInfo?.isNewUser) {
        await createDummyTasks(result.user);
      }
      router.push('/todos');
    }
  } catch (error) {
    console.error("Error processing redirect result:", error);
  }
});

const isAuthPage = computed(() => route.path === '/login');

const handleLogout = async () => {
  try {
    await signOut(auth);
    // ## This is the crucial fix: Navigate to the login page after sign-out.
    router.push('/login');
    isMenuOpen.value = false;
  } catch (error) {
    console.error("Failed to log out:", error);
  }
};

const createDummyTasks = async (user: User) => {
    const dummyTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { title: "Welcome to your new Vue to-do list!", completed: false, priority: "medium", userId: 1 },
        { title: "Click the pencil icon to edit this task", completed: false, priority: "low", userId: 1 },
    ];
    await addMultipleTodosToFirestore(user.uid, dummyTodos);
};
</script>

<template>
  <div v-if="authStore.loading" class="flex justify-center items-center h-screen bg-gray-100 dark:bg-slate-900">
    <LoaderSpin class="h-12 w-12 text-indigo-600" />
  </div>

  <div v-else class="flex flex-col min-h-screen antialiased">
    <header v-if="!isAuthPage && authStore.user" class="bg-indigo-600 text-white shadow-md relative z-10">
        <nav class="container mx-auto px-4 py-3 flex justify-between items-center max-w-6xl">
          <h1 class="text-xl sm:text-2xl font-bold">
            <RouterLink to="/todos" class="text-white hover:text-indigo-100">
              MyTodoApp
            </RouterLink>
          </h1>

          <div class="flex items-center gap-2">
            <!-- Desktop Menu -->
            <div class="hidden sm:flex items-center gap-4">
              <!-- Safety check for user email -->
              <span v-if="authStore.user.email" class="text-sm font-medium">{{ authStore.user.email }}</span>
              <Button variant="secondary" size="sm" @click="handleLogout">Logout</Button>
            </div>

            <!-- Theme Toggle -->
            <button @click="themeStore.toggleTheme" class="p-2 rounded-full hover:bg-indigo-700">
              <SunIcon v-if="themeStore.theme === 'dark'" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>

            <!-- Hamburger Button (mobile only) -->
            <div class="sm:hidden">
              <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-md">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <!-- Mobile Menu Dropdown -->
        <div v-if="isMenuOpen" class="sm:hidden absolute top-full left-0 right-0 bg-indigo-700 p-4 space-y-3 shadow-lg">
            <div v-if="authStore.user.email" class="text-center text-sm font-medium border-b border-indigo-500 pb-3 mb-3">{{ authStore.user.email }}</div>
            <Button variant="secondary" class="w-full" @click="handleLogout">Logout</Button>
        </div>
    </header>

    <main :class="['flex-grow', isAuthPage ? 'grid place-items-center bg-white dark:bg-slate-950' : 'bg-gray-100 dark:bg-slate-900']">
      <RouterView />
    </main>
  </div>
</template>

