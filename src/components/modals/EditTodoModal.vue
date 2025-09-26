<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Todo, Priority } from '../../utils/db';
import Dialog from '../Dialog.vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import Select from '../Select.vue';
import Checkbox from '../Checkbox.vue';
import EditIcon from '../icons/EditIcon.vue';
import LoaderSpin from '../icons/LoaderSpin.vue';

const props = defineProps<{
  isOpen: boolean;
  todo: Todo | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updateTodo', updatedData: Partial<Todo>): void;
}>();

// State management 
const title = ref('');
const completed = ref(false);
const dueDate = ref('');
const priority = ref<Priority>('low');
const updating = ref(false);
const error = ref<string | null>(null);

watch(() => props.todo, (newTodo) => {
  if (newTodo) {
    title.value = newTodo.title;
    completed.value = newTodo.completed;
    dueDate.value = newTodo.dueDate || '';
    priority.value = newTodo.priority || 'low';
  }
});

// Submit handler function.
const handleSubmit = async () => {
  if (!title.value.trim()) {
    error.value = 'Title cannot be empty.';
    return;
  }
  updating.value = true;
  error.value = null;
  try {
    emit('updateTodo', { 
      title: title.value, 
      completed: completed.value, 
      dueDate: dueDate.value, 
      priority: priority.value 
    });
    emit('close');
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    updating.value = false;
  }
};
</script>

<template>
  <Dialog 
    :is-open="isOpen" 
    @close="emit('close')" 
    title="Edit Task" 
    description="Make changes to your task below."
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid gap-4 py-4">
        <div class="space-y-2">
          <label for="edit-title" class="text-sm font-medium dark:text-slate-300">Title</label>
          <Input id="edit-title" v-model="title" aria-label="Todo title" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
                <label for="edit-due-date" class="text-sm font-medium dark:text-slate-300">Due Date</label>
                <Input id="edit-due-date" type="date" v-model="dueDate" />
            </div>
            <div class="space-y-2">
                <label for="edit-priority" class="text-sm font-medium dark:text-slate-300">Priority</label>
                <Select id="edit-priority" v-model="priority">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Select>
            </div>
        </div>

        <Checkbox
          id="edit-completed"
          label="Mark as completed"
          v-model="completed"
        />
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" variant="outline" @click="emit('close')" :disabled="updating">Cancel</Button>
        <Button type="submit" :disabled="updating">
          <LoaderSpin v-if="updating" class="mr-2" />
          <EditIcon v-else class="mr-2 h-4 w-4" />
          {{ updating ? 'Saving...' : 'Save Changes' }}
        </Button>
      </div>
    </form>
  </Dialog>
</template>
