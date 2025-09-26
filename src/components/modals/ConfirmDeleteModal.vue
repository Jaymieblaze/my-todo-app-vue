<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '../../utils/db';
import Dialog from '../Dialog.vue';
import Button from '../Button.vue';
import TrashIcon from '../icons/TrashIcon.vue';
import LoaderSpin from '../icons/LoaderSpin.vue';

// Define the props the component accepts without assigning to an unused variable.
defineProps<{
  isOpen: boolean;
  todo: Todo | null;
}>();

// Define the events this component can emit.
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'deleteTodo'): void;
}>();

// State management for the deleting process, like React's `useState`.
const deleting = ref(false);
const error = ref<string | null>(null);

// The handler function for the delete action.
const handleDelete = async () => {
  deleting.value = true;
  error.value = null;
  try {
    // Emit the 'deleteTodo' event to the parent component.
    emit('deleteTodo');
    emit('close'); // Close the modal on success
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    deleting.value = false;
  }
};
</script>

<template>
  <!-- The Dialog is conditionally rendered based on the isOpen prop -->
  <Dialog 
    :is-open="isOpen" 
    @close="emit('close')" 
    title="Are you absolutely sure?"
  >
    <div class="py-4">
      <p class="text-sm text-gray-500 dark:text-slate-400">
        This action cannot be undone. This will permanently delete the task:
        <!-- Use `v-if` to safely access the todo title -->
        <strong v-if="todo" class="block mt-1 text-gray-700 dark:text-slate-200">{{ todo.title }}</strong>
      </p>
      <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
    </div>
    <div class="flex justify-end gap-2">
      <Button variant="outline" @click="emit('close')" :disabled="deleting">Cancel</Button>
      <Button variant="destructive" @click="handleDelete" :disabled="deleting">
        <LoaderSpin v-if="deleting" class="mr-2" />
        <TrashIcon v-else class="mr-2 h-4 w-4" />
        {{ deleting ? 'Deleting...' : 'Yes, delete task' }}
      </Button>
    </div>
  </Dialog>
</template>

