<script setup lang="ts">
// 1. Import useRouter from vue-router to handle navigation.
import { useRouter } from 'vue-router';
// 2. Import the Vue versions of your reusable components.
import Card from '../components/Card.vue';
import CardHeader from '../components/CardHeader.vue';
import CardTitle from '../components/CardTitle.vue';
import CardDescription from '../components/CardDescription.vue';
import CardContent from '../components/CardContent.vue';
import Button from '../components/Button.vue';

// 3. Get the router instance. This is the Vue equivalent of React's useNavigate hook.
const router = useRouter();

// 4. A simple function to handle navigation.
const goHome = () => {
  router.push('/todos');
};
</script>

<template>
  <!-- 5. The template structure is a direct translation of the JSX. -->
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
    <Card class="max-w-md w-full text-center p-8">
      <CardHeader>
        <CardTitle class="text-4xl font-bold text-gray-800 dark:text-slate-100 mb-2">404</CardTitle>
        <CardDescription class="text-xl text-gray-600 dark:text-slate-400 mb-4">Page Not Found</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-gray-700 dark:text-slate-300 mb-6">
          The page you are looking for does not exist or an unexpected error occurred.
        </p>
        <!-- 6. Use the `@click` directive to call the navigation function. -->
        <Button @click="goHome">
          Go to Todo List
        </Button>
      </CardContent>
    </Card>
  </div>
</template>
