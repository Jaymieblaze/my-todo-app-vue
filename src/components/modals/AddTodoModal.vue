<script setup lang="ts">
import { ref } from 'vue';
import type { Todo, Priority } from '../../utils/db';
import Dialog from '../Dialog.vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import Select from '../Select.vue';
import PlusIcon from '../icons/PlusIcon.vue';
import LoaderSpin from '../icons/LoaderSpin.vue';

// Component's props and events.
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addTodo', newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>): void;
}>();

// State management
const title = ref('');
const dueDate = ref('');
const priority = ref<Priority>('low');
const adding = ref(false);
const error = ref<string | null>(null);

// Submit handler function.
const handleSubmit = async () => {
  if (!title.value.trim()) {
    error.value = 'Title cannot be empty.';
    return;
  }
  adding.value = true;
  error.value = null;
  try {
    emit('addTodo', { 
      title: title.value, 
      completed: false, 
      userId: 1, 
      dueDate: dueDate.value, 
      priority: priority.value 
    });
    
    // Reset the form and close the modal.
    title.value = '';
    dueDate.value = '';
    priority.value = 'low';
    emit('close');
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    adding.value = false;
  }
};
</script>

<template>
  <Dialog 
    :is-open="isOpen" 
    @close="emit('close')" 
    title="Add a New Task" 
    description="What do you need to get done?"
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <label for="title" class="text-sm font-medium dark:text-slate-300">Title</label>
          <Input
            id="title"
            v-model="title"
            @input="error = null"
            placeholder="e.g., Finalize the project report"
            aria-label="Todo title"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <label for="due-date" class="text-sm font-medium dark:text-slate-300">Due Date</label>
            <Input id="due-date" type="date" v-model="dueDate" />
          </div>
          <div class="space-y-2">
            <label for="priority" class="text-sm font-medium dark:text-slate-300">Priority</label>
            <Select id="priority" v-model="priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>
        
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="emit('close')" :disabled="adding">Cancel</Button>
        <Button type="submit" :disabled="adding">
          <LoaderSpin v-if="adding" class="mr-2" />
          <PlusIcon v-else class="mr-2 h-4 w-4" />
          {{ adding ? 'Adding...' : 'Add Task' }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>
