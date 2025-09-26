<script setup lang="ts">
import { computed } from 'vue';
import Button from './Button.vue';

const props = defineProps<{
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}>();

const emit = defineEmits(['page-change']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));
const pageNumbers = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1));
</script>

<template>
  <nav class="flex justify-center mt-6" aria-label="Pagination">
    <ul class="flex flex-wrap items-center gap-2 sm:gap-3">
      <li>
        <Button
          @click="emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
          variant="outline"
          class="min-h-touch min-w-touch"
          aria-label="Previous page"
        >
          Previous
        </Button>
      </li>
      
      <li v-for="page in pageNumbers" :key="page">
        <Button
          @click="emit('page-change', page)"
          :variant="page === currentPage ? 'default' : 'outline'"
          :class="`min-h-touch min-w-touch ${page === currentPage ? 'hover:bg-indigo-700' : ''}`"
          :aria-current="page === currentPage ? 'page' : undefined"
          :aria-label="`Page ${page}`"
        >
          {{ page }}
        </Button>
      </li>
      <li>
        <Button
          @click="emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
          variant="outline"
          class="min-h-touch min-w-touch"
          aria-label="Next page"
        >
          Next
        </Button>
      </li>
    </ul>
  </nav>
</template>
