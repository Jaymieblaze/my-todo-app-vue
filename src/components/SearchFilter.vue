<template>
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <input
        type="text"
        :value="searchTerm"
        @input="handleSearchChange"
        placeholder="Search tasks..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200"
      />
    </div>
    <div class="flex gap-2">
      <button
        @click="handleFilterChange('all')"
        :class="filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300'"
        class="px-4 py-2 rounded-md text-sm font-medium"
      >
        All
      </button>
      <button
        @click="handleFilterChange('completed')"
        :class="filterStatus === 'completed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300'"
        class="px-4 py-2 rounded-md text-sm font-medium"
      >
        Completed
      </button>
      <button
        @click="handleFilterChange('incomplete')"
        :class="filterStatus === 'incomplete' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-slate-300'"
        class="px-4 py-2 rounded-md text-sm font-medium"
      >
        Incomplete
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  searchTerm: string;
  filterStatus: 'all' | 'completed' | 'incomplete';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'search-change': [value: string];
  'filter-change': [status: 'all' | 'completed' | 'incomplete'];
}>();

// Methods for type-safe event handling
const handleSearchChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('search-change', target.value);
};

const handleFilterChange = (status: 'all' | 'completed' | 'incomplete') => {
  emit('filter-change', status);
};
</script>
