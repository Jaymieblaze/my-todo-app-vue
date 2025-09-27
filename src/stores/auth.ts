import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth } from '../firebase';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';
import router from '../router';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  let unsubscribeAuth: (() => void) | null = null; // To hold the listener cleanup

  function setUser(newUser: User | null) {
    user.value = newUser;
    loading.value = false; // Set loading to false whenever user changes
  }

  /**
   * Initializes the auth state listener and keeps it active for ongoing changes.
   */
  function init() {
    if (!unsubscribeAuth) {
      unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
      });
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await signOut(auth); // Just sign out; listener will set user to null
    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      loading.value = false;
    }
  }

  // Cleanup function for the store
  function cleanup() {
    if (unsubscribeAuth) {
      unsubscribeAuth();
      unsubscribeAuth = null;
    }
  }

  return { user, loading, setUser, init, logout, cleanup };
});
