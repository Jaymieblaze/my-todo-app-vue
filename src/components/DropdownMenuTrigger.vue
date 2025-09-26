<script setup lang="ts">
import { inject } from 'vue';

const dropdown = inject('dropdown') as { toggle: () => void };
</script>

<template>
  <button type="button" @click="dropdown.toggle">
    <slot />
  </button>
</template>
