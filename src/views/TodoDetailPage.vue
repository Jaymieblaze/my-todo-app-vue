<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// We'll assume you have a Pinia store for authentication
// import { useAuthStore } from '../stores/auth'; 
import { fetchTodoByIdFromFirestore } from '../utils/api';
import type { Todo, Priority } from '../utils/db';
import Button from '../components/Button.vue';
import Card from '../components/Card.vue';
import CardHeader from '../components/CardHeader.vue';
import CardTitle from '../components/CardTitle.vue';
import CardDescription from '../components/CardDescription.vue';
import CardContent from '../components/CardContent.vue';
import LoaderSpin from '../components/icons/LoaderSpin.vue';
import CheckCircleIcon from '../components/icons/CheckCircleIcon.vue';
import XCircleIcon from '../components/icons/XCircleIcon.vue';
import CalendarIcon from '../components/icons/CalendarIcon.vue';
import FlagIcon from '../components/icons/FlagIcon.vue';

// 1. STATE MANAGEMENT (like useState)
const todo = ref<Todo | null>(null);
const loading = ref(true);
const error = ref<Error | null>(null);

// 2. ROUTING (like useParams and useNavigate)
const route = useRoute();
const router = useRouter();
const todoId = route.params.todoId as string;

// 3. AUTHENTICATION (like useAuth)
// const authStore = useAuthStore();
// const user = authStore.user; 
// For now, we'll mock the user ID for simplicity
const mockUserId = "mock-user-id"; 


// 4. DATA FETCHING (like useEffect)
onMounted(async () => {
  if (!mockUserId || !todoId) {
    error.value = new Error("User or Todo ID is missing.");
    loading.value = false;
    return;
  }
  try {
    const data = await fetchTodoByIdFromFirestore(mockUserId, todoId);
    if (data) {
      todo.value = data;
    } else {
      error.value = new Error("Todo not found.");
    }
  } catch (fetchError) {
    error.value = fetchError as Error;
  } finally {
    loading.value = false;
  }
});

// 5. HELPERS 
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Not set';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

const priorityStyles = computed(() => {
    if (!todo.value?.priority) return '';
    const styles: Record<Priority, string> = {
        low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        high: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return styles[todo.value.priority];
});
</script>

<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-2xl">
    <Card class="shadow-lg border-gray-200/80 dark:border-slate-800">
      <CardHeader>
        <CardTitle class="text-2xl">Task Details</CardTitle>
        <CardDescription>Detailed information about your selected task.</CardDescription>
      </CardHeader>
      <CardContent>
        <!-- 6. Conditional rendering using v-if, v-else-if, and v-else -->
        <div v-if="loading" class="flex justify-center items-center h-48">
          <LoaderSpin class="h-8 w-8 text-indigo-600" />
        </div>
        <div v-else-if="error" class="text-center text-red-600 p-6">
          <p>{{ error.message }}</p>
        </div>
        <div v-else-if="todo" class="space-y-4 text-base">
          <div class="pb-4 border-b dark:border-slate-700">
            <p class="text-sm text-gray-500 dark:text-slate-400 mb-1">Title</p>
            <p class="text-lg text-gray-900 dark:text-slate-100 font-semibold">{{ todo.title }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-slate-400 flex items-center"><CalendarIcon class="h-4 w-4 mr-2"/> Due Date</p>
              <p class="font-medium dark:text-slate-200">{{ formatDate(todo.dueDate) }}</p>
            </div>
            <div class="space-y-1">
              <p class="text-sm text-gray-500 dark:text-slate-400 flex items-center"><FlagIcon class="h-4 w-4 mr-2"/> Priority</p>
              <span :class="['px-2 py-1 text-xs font-semibold rounded-full capitalize', priorityStyles]">
                {{ todo.priority || 'Low' }}
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t dark:border-slate-700">
            <span class="text-gray-500 dark:text-slate-400 font-medium">Status</span>
            <div :class="['flex items-center gap-2 font-semibold', todo.completed ? 'text-green-600' : 'text-gray-500 dark:text-slate-400']">
              <CheckCircleIcon v-if="todo.completed" class="h-5 w-5" />
              <XCircleIcon v-else class="h-5 w-5" />
              <span>{{ todo.completed ? 'Completed' : 'Incomplete' }}</span>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-600 dark:text-slate-400 p-6">
          <p>No details to display.</p>
        </div>
      </CardContent>
      <div class="p-6 pt-4 flex justify-between items-center">
        <!-- 7. Use `@click` for event handling -->
        <Button variant="outline" @click="router.push('/todos')">
          Back to List
        </Button>
        <p v-if="todo" class="text-xs text-gray-400 dark:text-slate-500">Task ID: {{ todo.id }}</p>
      </div>
    </Card>
  </div>
</template>
