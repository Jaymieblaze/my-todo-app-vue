import { ref } from 'vue';
import { defineStore } from 'pinia';
import { onSnapshot, collection, Unsubscribe } from 'firebase/firestore';
import { firestore } from '../firebase';
import type { Todo } from '../utils/db';

export const useTodoStore = defineStore('todos', () => {
  // --- STATE ---
  const todos = ref<Todo[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);
  let unsubscribe: Unsubscribe | null = null; // To hold the listener cleanup function

  // --- ACTIONS ---

  // Sets up the real-time listener for a specific user
  function init(userId: string) {
    if (unsubscribe) {
      unsubscribe(); // Prevent multiple listeners
    }
    
    const todosCollectionRef = collection(firestore, `users/${userId}/todos`);
    
    unsubscribe = onSnapshot(todosCollectionRef, (snapshot) => {
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
      console.error("Error fetching todos:", err);
      error.value = err;
      loading.value = false;
    });
  }

  // Cleans up the listener and resets the state. This is crucial for logout.
  function dispose() {
    if (unsubscribe) {
      unsubscribe();
    }
    todos.value = [];
    loading.value = true;
    error.value = null;
    unsubscribe = null;
  }

  return { todos, loading, error, init, dispose };
});

