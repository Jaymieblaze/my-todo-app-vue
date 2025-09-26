<script setup lang="ts">

defineProps<{
  modelValue?: boolean; 
  label?: string;
  id?: string;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="flex items-center space-x-2">
    <input
      type="checkbox"
      :id="id"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 peer dark:border-slate-700 dark:bg-slate-800 dark:ring-offset-slate-900 dark:focus:ring-indigo-600 dark:checked:bg-indigo-500"
    />
    <!-- Only renders the label if the 'label' prop is provided -->
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300"
    >
      {{ label }}
    </label>
  </div>
</template>
