import { ref } from 'vue';
import { defineStore } from 'pinia';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';

// `defineStore` creates a new store. The first argument is a unique ID.
export const useAuthStore = defineStore('auth', () => {
  // 1. STATE: `ref()` creates reactive state properties, equivalent to React's `useState`.
  const user = ref<User | null>(null);
  const loading = ref(true);

  // 2. ACTIONS: A function that can be called to initialize the store's logic.
  // This is where we'll put the `onAuthStateChanged` listener.
  const init = () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      loading.value = false;
    });
  };

  // 3. RETURN: We expose the state and any actions for components to use.
  return {
    user,
    loading,
    init,
  };
});
