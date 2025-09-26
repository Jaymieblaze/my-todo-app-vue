import { ref, onMounted, onUnmounted } from 'vue';

// A Composable is a function that can use Vue's Composition API (ref, computed, etc.)
export function useOnlineStatus() {
  // 1. `ref` creates a reactive variable, just like React's `useState`.
  const isOnline = ref(navigator.onLine);

  const handleOnline = () => (isOnline.value = true);
  const handleOffline = () => (isOnline.value = false);

  // 2. `onMounted` is a lifecycle hook, equivalent to `useEffect` with an empty array `[]`.
  // It runs once when the component is first added to the page.
  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  // 3. `onUnmounted` is the cleanup function, also like the return function in `useEffect`.
  // It runs when the component is removed from the page.
  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  // 4. Return the reactive state variable for the component to use.
  return { isOnline };
}
