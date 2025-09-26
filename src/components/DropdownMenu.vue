<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement | null>(null);

// Functions to control the state.
const toggle = () => (isOpen.value = !isOpen.value);
const close = () => (isOpen.value = false);

provide('dropdown', { isOpen, toggle, close });

// This logic handles closing the menu when a user clicks outside of it.
const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    close();
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <!-- The <slot /> renders the child components (Trigger and Content) -->
    <slot />
  </div>
</template>
