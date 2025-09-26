<script setup lang="ts">
import Input from './Input.vue';
import Button from './Button.vue';

type FilterStatus = 'all' | 'completed' | 'incomplete';

defineProps<{
  searchTerm: string;
  filterStatus: FilterStatus;
}>();


const emit = defineEmits<{
  (e: 'update:searchTerm', value: string): void;
  (e: 'update:filterStatus', status: FilterStatus): void;
}>();
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 sm:mb-0">
    
    <Input
      type="text"
      placeholder="Search todos by title..."
      :value="searchTerm"
      @input="emit('update:searchTerm', ($event.target as HTMLInputElement).value)"
      class="flex-1"
      aria-label="Search todos"
    />
    <div class="flex space-x-2">
      
      <Button
        @click="emit('update:filterStatus', 'all')"
        :variant="filterStatus === 'all' ? 'default' : 'outline'"
        :aria-pressed="filterStatus === 'all'"
      >
        All
      </Button>
      <Button
        @click="emit('update:filterStatus', 'completed')"
        :variant="filterStatus === 'completed' ? 'default' : 'outline'"
        :aria-pressed="filterStatus === 'completed'"
      >
        Completed
      </Button>
      <Button
        @click="emit('update:filterStatus', 'incomplete')"
        :variant="filterStatus === 'incomplete' ? 'default' : 'outline'"
        :aria-pressed="filterStatus === 'incomplete'"
      >
        Incomplete
      </Button>
    </div>
  </div>
</template>
