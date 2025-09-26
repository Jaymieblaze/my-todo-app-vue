<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

// Import the Vue components we've already created for the fallback UI
import Card from './Card.vue';
import CardHeader from './CardHeader.vue';
import CardTitle from './CardTitle.vue';
import CardDescription from './CardDescription.vue';
import CardContent from './CardContent.vue';
import Button from './Button.vue';

// Define the props the component accepts.
const props = defineProps<{
  showDetails?: boolean;
}>();

// Define the reactive state for tracking errors
const hasError = ref(false);
const error = ref<Error | null>(null);
const errorInfo = ref<string | null>(null);

onErrorCaptured((err, instance, info) => {
  console.error("Error captured in boundary:", err, info);
  hasError.value = true;
  error.value = err;
  errorInfo.value = info; // `info` contains details about where the error occurred.

  // Return `false` to prevent the error from propagating further.
  return false;
});

// Function to reset the error state and try rendering the children again.
const resetError = () => {
  hasError.value = false;
  error.value = null;
  errorInfo.value = null;
};
</script>

<template>
  <!-- Conditionally render either the fallback UI or the children. -->
  <div v-if="hasError">
    <!-- This is the user-friendly fallback UI that displays when an error is caught. -->
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card class="max-w-md w-full text-center p-8">
        <CardHeader>
          <CardTitle class="text-red-600">Something went wrong.</CardTitle>
          <CardDescription>
            We're sorry, an unexpected error occurred.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <details v-if="props.showDetails && error" class="mt-4 text-left text-sm text-gray-700 p-4 border border-gray-200 rounded-md bg-gray-50">
            <summary class="font-semibold cursor-pointer">Error Details</summary>
            <pre class="mt-2 whitespace-pre-wrap break-words">
              {{ error?.toString() }}
              <br />
              Stack trace: {{ errorInfo }}
            </pre>
          </details>
          <Button @click="resetError" class="mt-6">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
  <!-- If there is no error, the `<slot />` renders the child components. -->
  <slot v-else></slot>
</template>

