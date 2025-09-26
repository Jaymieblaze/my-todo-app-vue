<script setup lang="ts">
import { inject, Ref } from 'vue';

const dropdown = inject('dropdown') as { isOpen: Ref<boolean> };
</script>

<template>
  <!-- Conditionally renders the content based on the `isOpen` state. -->
  <div
    v-if="dropdown.isOpen.value"
    class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg border border-gray-200/80 focus:outline-none z-10 dark:bg-gray-800 dark:border-gray-700"
  >
    <div class="py-1">
      <slot />
    </div>
  </div>
</template>
