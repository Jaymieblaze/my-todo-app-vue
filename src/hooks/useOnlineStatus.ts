import { ref, onMounted, onUnmounted } from 'vue';

export const useOnlineStatus = () => {
  const isOnline = ref(navigator.onLine); // Initialize with current status

  const handleOnline = () => {
    isOnline.value = true;
  };

  const handleOffline = () => {
    isOnline.value = false;
  };

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return isOnline; // Returns a reactive ref
};