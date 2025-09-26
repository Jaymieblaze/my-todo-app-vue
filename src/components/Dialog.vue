<script setup lang="ts">

defineProps<{
  isOpen: boolean;
  title: string;
  description?: string;
}>();

const emit = defineEmits(['close']);
</script>

<template>
  <!-- Conditionally render the entire dialog -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-6">
    <div class="relative w-full max-w-[90vw] sm:max-w-lg rounded-lg border bg-white p-6 shadow-lg dark:bg-slate-900 dark:border-slate-800">
      <div class="flex flex-col space-y-1.5 text-center sm:text-left">
        <h3 class="text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-slate-100">{{ title }}</h3>
        <p v-if="description" class="text-sm text-gray-500 dark:text-slate-400">{{ description }}</p>
      </div>
      <div class="py-4">
        <slot />
      </div>
      <button
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:pointer-events-none dark:ring-offset-slate-900 dark:focus:ring-indigo-400"
        @click="emit('close')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 text-gray-500 dark:text-gray-400">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    </div>
  </div>
</template>
