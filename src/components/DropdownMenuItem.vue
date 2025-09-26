<script setup lang="ts">
import { inject } from 'vue';

const emit = defineEmits(['select']);
const dropdown = inject('dropdown') as { close: () => void };

const handleClick = () => {
  emit('select'); // 2. Emit the event to the parent.
  dropdown.close(); // 3. Close the dropdown menu.
};
</script>

<template>
  <button
    @click="handleClick"
    class="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
  >
    <slot />
  </button>
</template>
