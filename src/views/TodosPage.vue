<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { onSnapshot, collection } from 'firebase/firestore';
import { firestore } from '../firebase';
import type { Todo, Priority } from '../utils/db';
import { addMultipleTodosToFirestore, performFirestoreOperation } from '../utils/api';
import { useOnlineStatus } from '../composables/useOnlineStatus';

// --- COMPONENT IMPORTS ---
import Alert from '../components/Alert.vue';
import AddTodoModal from '../components/modals/AddTodoModal.vue';
import EditTodoModal from '../components/modals/EditTodoModal.vue';
import ConfirmDeleteModal from '../components/modals/ConfirmDeleteModal.vue';
import AIAssistantModal from '../components/modals/AIAssistantModal.vue';
import TodoItem from '../components/TodoItem.vue';
import Pagination from '../components/Pagination.vue';
import SearchFilter from '../components/SearchFilter.vue';
import Button from '../components/Button.vue';
import DropdownMenu from '@/components/DropdownMenu.vue';
import DropdownMenuTrigger from '@/components/DropdownMenuTrigger.vue'; 
import DropdownMenuContent from '@/components/DropdownMenuContent.vue';
import DropdownMenuItem from '@/components/DropdownMenuItem.vue';
import Card from '../components/Card.vue';
import CardHeader from '../components/CardHeader.vue';
import CardTitle from '../components/CardTitle.vue';
import CardDescription from '../components/CardDescription.vue';
import CardContent from '../components/CardContent.vue';
import PlusIcon from '../components/icons/PlusIcon.vue';
import LoaderSpin from '../components/icons/LoaderSpin.vue';
import SparklesIcon from '../components/icons/SparklesIcon.vue';
import ArrowUpDownIcon from '../components/icons/ArrowUpDownIcon.vue';

// --- STATE MANAGEMENT ---
const router = useRouter();
// In a real app, this would come from a Pinia store
const user = ref({ uid: "mock-user-id", displayName: "Jaymie Blaze" }); 

const todos = ref<Todo[]>([]);
const loading = ref(true);
const error = ref<Error | null>(null);
const operationError = ref<string | null>(null);
const currentPage = ref(1);
const searchTerm = ref('');
const filterStatus = ref<'all' | 'completed' | 'incomplete'>('all');
const sortBy = ref<'createdAt' | 'dueDate' | 'priority'>('createdAt');
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isAIAssistantOpen = ref(false);
const selectedTodo = ref<Todo | null>(null);
const { isOnline } = useOnlineStatus(); // Use the composable

const ITEMS_PER_PAGE = 10;

// --- DATA FETCHING & LIFECYCLE ---
let unsubscribeFromTodos: () => void;

onMounted(() => {
  if (!user.value) return;
  const todosCollectionRef = collection(firestore, `users/${user.value.uid}/todos`);
  unsubscribeFromTodos = onSnapshot(todosCollectionRef, (snapshot) => {
    todos.value = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        completed: data.completed || false,
        userId: data.userId || 0,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        isSynced: data.isSynced ?? 1,
        isDeleted: data.isDeleted ?? 0,
        dueDate: data.dueDate,
        priority: data.priority || 'low',
      };
    });
    loading.value = false;
  }, (err) => {
    error.value = err;
    loading.value = false;
  });

  onUnmounted(() => {
    if (unsubscribeFromTodos) unsubscribeFromTodos();
  });
});

// --- METHODS ---
const handleOperation = async (action: () => Promise<any>) => {
  operationError.value = null;
  try {
    await action();
  } catch (e) {
    operationError.value = (e as Error).message || 'An unexpected error occurred.';
  }
};

const handleAddTodo = (newTodoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!user.value) return;
  handleOperation(() => performFirestoreOperation(user.value!.uid, 'add', newTodoData));
};

const handleAddMultipleTodos = (newTasks: Omit<Todo, 'id'>[]) => {
  if (!user.value) return;
  handleOperation(() => addMultipleTodosToFirestore(user.value!.uid, newTasks));
};

const handleUpdateTodo = (todoToUpdate: Todo, updatedData: Partial<Todo>) => {
  if (!user.value) return;
  const payload = { id: todoToUpdate.id, ...updatedData };
  handleOperation(() => performFirestoreOperation(user.value!.uid, 'update', payload));
};

const handleDeleteTodo = (todoToDelete: Todo) => {
  if (!user.value) return;
  handleOperation(() => performFirestoreOperation(user.value!.uid, 'delete', todoToDelete));
};
  
const handleOpenEditModal = (todo: Todo) => {
  selectedTodo.value = todo;
  isEditModalOpen.value = true;
};

const handleOpenDeleteModal = (todo: Todo) => {
  selectedTodo.value = todo;
  isDeleteModalOpen.value = true;
};

// --- COMPUTED PROPERTIES ---
const firstName = computed(() => user.value?.displayName?.split(' ')[0] || 'User');

const sortOptions = {
  createdAt: 'Date Created',
  dueDate: 'Due Date',
  priority: 'Priority'
};

const sortedAndFilteredTodos = computed(() => {
  const priorityOrder: Record<Priority, number> = { high: 1, medium: 2, low: 3 };
  return [...todos.value] // Create a shallow copy to sort
    .filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
      (filterStatus.value === 'all' || (filterStatus.value === 'completed' && todo.completed) || (filterStatus.value === 'incomplete' && !todo.completed))
    )
    .sort((a, b) => {
      switch (sortBy.value) {
        case 'dueDate':
          return (a.dueDate || 'z').localeCompare(b.dueDate || 'z');
        case 'priority':
          return (priorityOrder[a.priority || 'low']) - (priorityOrder[b.priority || 'low']);
        case 'createdAt':
        default:
          return (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime());
      }
    });
});

const currentTodos = computed(() => {
  const startIndex = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return sortedAndFilteredTodos.value.slice(startIndex, startIndex + ITEMS_PER_PAGE);
});

const totalPages = computed(() => Math.ceil(sortedAndFilteredTodos.value.length / ITEMS_PER_PAGE));
</script>

<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
    <Alert v-if="operationError" variant="destructive" class="mb-4">
      <p>{{ operationError }}</p>
    </Alert>

    <Card class="mb-6 bg-white/50 backdrop-blur-sm border-gray-200/80 shadow-sm dark:bg-slate-900/50 dark:border-slate-800">
      <CardHeader>
        <div class="flex justify-between items-start">
          <div>
            <CardTitle class="text-2xl text-gray-800 dark:text-slate-100">Hi {{ firstName }},</CardTitle>
            <CardDescription class="mt-1 dark:text-slate-400">Here are your real-time tasks.</CardDescription>
          </div>
          <div class="flex items-center text-xs pt-1">
            <span :class="['h-2 w-2 rounded-full mr-2', isOnline ? 'bg-green-500' : 'bg-red-500']"></span>
            <span class="text-gray-500 dark:text-slate-400">{{ isOnline ? 'Live Sync' : 'Offline' }}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="flex justify-end gap-2 pt-4 pb-4">
        <Button @click="isAIAssistantOpen = true" variant="outline">
          <SparklesIcon class="mr-2 h-4 w-4 text-indigo-500" /> AI Assistant
        </Button>
        <Button @click="isAddModalOpen = true">
          <PlusIcon class="mr-2 h-4 w-4" /> Add New Todo
        </Button>
      </CardContent>
    </Card>

    <Card class="bg-white/50 backdrop-blur-sm border-gray-200/80 shadow-sm dark:bg-slate-900/50 dark:border-slate-800">
      <CardContent class="mt-2 pt-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 md:gap-4 lg:gap-4 mb-6">
          <div class="w-full flex-grow mb-0">
            <SearchFilter
              :search-term="searchTerm"
              @update:search-term="searchTerm = $event"
              :filter-status="filterStatus"
              @update:filter-status="filterStatus = $event"
            />
          </div>
          <div class="w-full sm:w-auto flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 h-10 px-4 py-2 w-full sm:w-auto dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Sort by: {{ sortOptions[sortBy] }}
                <ArrowUpDownIcon class="ml-2 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @select="sortBy = 'createdAt'">Date Created</DropdownMenuItem>
                <DropdownMenuItem @select="sortBy = 'dueDate'">Due Date</DropdownMenuItem>
                <DropdownMenuItem @select="sortBy = 'priority'">Priority</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div v-if="loading" class="flex justify-center items-center h-48">
          <LoaderSpin class="h-8 w-8 text-indigo-600" />
        </div>
        <div v-else-if="error" class="text-center text-red-600 p-6">
          <p>{{ error.message }}</p>
        </div>
        <div v-else-if="sortedAndFilteredTodos.length === 0" class="text-center text-gray-600 dark:text-gray-400 p-6">
          <p class="text-lg font-semibold">No tasks found. Create a New Task</p>
        </div>
        <div v-else class="divide-y divide-gray-200/80 dark:divide-slate-800">
          <TodoItem
            v-for="todo in currentTodos"
            :key="todo.id"
            :todo="todo"
            @view-detail="router.push(`/todos/${$event}`)"
            @edit="handleOpenEditModal"
            @delete="handleOpenDeleteModal"
          />
        </div>
        
        <Pagination
          v-if="totalPages > 1"
          :total-items="sortedAndFilteredTodos.length"
          :items-per-page="ITEMS_PER_PAGE"
          :current-page="currentPage"
          @page-change="currentPage = $event"
        />
      </CardContent>
    </Card>

    <AddTodoModal :is-open="isAddModalOpen" @close="isAddModalOpen = false" @add-todo="handleAddTodo" />
    <AIAssistantModal :is-open="isAIAssistantOpen" @close="isAIAssistantOpen = false" @add-tasks="handleAddMultipleTodos" />
    
    <template v-if="selectedTodo">
      <EditTodoModal :is-open="isEditModalOpen" @close="isEditModalOpen = false" :todo="selectedTodo" @update-todo="handleUpdateTodo(selectedTodo, $event)" />
      <ConfirmDeleteModal :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false" :todo="selectedTodo" @delete-todo="handleDeleteTodo(selectedTodo)" />
    </template>
  </div>
</template>

