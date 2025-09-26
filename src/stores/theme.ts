import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

export type Theme = 'light' | 'dark';

// ## This is the fix: A helper function to get the initial theme value.
const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('theme') as Theme | null;
  if (savedTheme) {
    return savedTheme;
  }
  return 'light';
};

export const useThemeStore = defineStore('theme', () => {
  // ## The ref is now initialized with a simple string value, not a function.
  const theme = ref<Theme>(getInitialTheme());

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  }

  // This watcher will now work correctly on its initial run.
  watch(theme, (newTheme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  }, { immediate: true });

  return { theme, toggleTheme };
});

