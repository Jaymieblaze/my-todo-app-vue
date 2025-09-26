<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '../../utils/db';
import Dialog from '../Dialog.vue';
import Button from '../Button.vue';
import Input from '../Input.vue';
import LoaderSpin from '../icons/LoaderSpin.vue';


const generateTasksFromAI = async (prompt: string): Promise<string[]> => {
  const endpoint = '/api/generate-tasks';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with status: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data.tasks)) {
      return data.tasks;
    } else {
      throw new Error("Invalid response format from the AI service.");
    }
  } catch (error) {
    console.error("Error calling AI service:", error);
    throw new Error("Failed to generate tasks from AI.");
  }
};

// Component's props and events.
defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'addTasks', tasks: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[]): void;
}>();

// State management
const prompt = ref('');
const generatedTasks = ref<string[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Handler for generating tasks.
const handleGenerate = async () => {
  if (!prompt.value.trim()) {
    error.value = 'Please enter a prompt.';
    return;
  }
  loading.value = true;
  error.value = null;
  generatedTasks.value = [];
  try {
    const tasks = await generateTasksFromAI(prompt.value);
    generatedTasks.value = tasks;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
};

// Handler for adding the generated tasks to the main list.
const handleAddSelectedTasks = () => {
  const newTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = generatedTasks.value.map(title => ({
    title,
    completed: false,
    userId: 1, // This would typically come from the logged-in user
    priority: 'low',
  }));
  emit('addTasks', newTodos);
  handleClose();
};

// Resets the modal's state and emits the 'close' event.
const handleClose = () => {
  prompt.value = '';
  generatedTasks.value = [];
  error.value = null;
  emit('close');
};
</script>

<template>
  <Dialog 
    :is-open="isOpen" 
    @close="handleClose" 
    title="AI Assistant" 
    description="Describe a goal, and the AI will generate a to-do list for you."
  >
    <div class="space-y-4 py-4">
      <Input
        v-model="prompt"
        placeholder="e.g., Plan a team retreat"
        :disabled="loading"
      />
      <Button @click="handleGenerate" class="w-full" :disabled="loading">
        <LoaderSpin v-if="loading" class="mr-2" />
        Generate Tasks
      </Button>
      
      <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

      <div v-if="generatedTasks.length > 0" class="space-y-2 pt-4">
        <h3 class="font-semibold dark:text-slate-200">Suggested Tasks:</h3>
        <ul class="list-disc list-inside bg-gray-50 dark:bg-slate-800 p-4 rounded-md">
          <li v-for="(task, index) in generatedTasks" :key="index" class="text-gray-700 dark:text-slate-300">{{ task }}</li>
        </ul>
        <Button @click="handleAddSelectedTasks" class="w-full !mt-4">Add to My List</Button>
      </div>
    </div>
  </Dialog>
</template>
