<script setup lang="ts">
import { computed } from 'vue';
import type { Todo, Priority } from '../utils/db'; 
import EditIcon from './icons/EditIcon.vue';
import TrashIcon from './icons/TrashIcon.vue';
import CheckCircleIcon from './icons/CheckCircleIcon.vue';
import XCircleIcon from './icons/XCircleIcon.vue';

// Define the component's props
const props = defineProps<{
  todo: Todo;
}>();

// Define the events that this component can emit to its parent.
const emit = defineEmits<{
  (e: 'viewDetail', id: string): void;
  (e: 'edit', todo: Todo): void;
  (e: 'delete', todo: Todo): void;
}>();

// Helper function to format dates.
const formatDate = (dateString?: string) => {
  if (!dateString) return null;
  // Vue templates can handle timezone issues, so we can simplify this.
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

const priorityStyle = computed(() => {
  const priorityColors: Record<Priority, string> = {
    low: 'border-gray-400 text-gray-500 dark:text-gray-400',
    medium: 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-500/50',
    high: 'border-red-500 text-red-600 dark:text-red-400 dark:border-red-500/50',
  };
  return priorityColors[props.todo.priority || 'low'];
});
</script>

<template>
  <div class="group flex items-center p-4 border-b border-gray-200/80 hover:bg-gray-50 transition-colors duration-200 dark:border-slate-800 dark:hover:bg-slate-800/50">
    <div class="flex-1 flex items-center space-x-4 cursor-pointer min-w-0" @click="emit('viewDetail', todo.id)">
      <CheckCircleIcon v-if="todo.completed" class="h-6 w-6 text-green-500 flex-shrink-0" />
      <XCircleIcon v-else class="h-6 w-6 text-gray-400 group-hover:text-gray-600 dark:text-slate-600 dark:group-hover:text-slate-400 flex-shrink-0" />
      
      <div class="flex-1 min-w-0">
        <span 
          :class="[
            'text-lg truncate block', 
            todo.completed ? 'line-through text-gray-400 dark:text-slate-600' : 'text-gray-800 dark:text-slate-200'
          ]"
        >
          {{ todo.title }}
        </span>
        <div class="flex items-center space-x-3 text-sm text-gray-500 dark:text-slate-400 mt-1">
          <span v-if="todo.dueDate">Due: {{ formatDate(todo.dueDate) }}</span>
          <span v-if="todo.dueDate && todo.priority" class="text-gray-300 dark:text-slate-600">|</span>
          <span :class="['capitalize border text-xs font-semibold px-2 py-0.5 rounded-full', priorityStyle]">
            {{ todo.priority }}
          </span>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 ml-4">
      <button @click="emit('edit', todo)" class="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50" :aria-label="`Edit todo: ${todo.title}`">
        <EditIcon class="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
      </button>
      <button @click="emit('delete', todo)" class="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50" :aria-label="`Delete todo: ${todo.title}`">
        <TrashIcon class="h-5 w-5 text-red-600 dark:text-red-400" />
      </button>
    </div>
  </div>
</template>
