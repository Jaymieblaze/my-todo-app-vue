import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '../firebase';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import router from '../router';

// A promise that resolves when the initial auth state is known.
let authStatePromise: Promise<void> | null = null;

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);

  function setUser(newUser: User | null) {
    user.value = newUser;
  }

  /**
   * Initializes the auth state listener and returns a promise that resolves
   * when the first auth state is received.
   */
  function init() {
    if (!authStatePromise) {
      authStatePromise = new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          loading.value = false;
          // Unsubscribe after the first state change to avoid memory leaks
          // and ensure the promise resolves only once.
          unsubscribe();
          resolve();
        });
      });
    }
    return authStatePromise;
  }

  async function logout() {
    loading.value = true;
    try {
      await signOut(auth);
      setUser(null);
      // Redirect to the named auth route, which is '/'
      router.push({ name: 'auth' });
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      loading.value = false;
    }
  }

  return { user, loading, setUser, init, logout };
});
