<script setup lang="ts">

defineProps<{
  modelValue?: string | number;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  
  <select
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    class="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-200 dark:ring-offset-slate-950"
  >
    <slot />
  </select>
</template>
