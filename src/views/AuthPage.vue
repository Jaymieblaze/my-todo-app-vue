<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  AuthError,
  User,
  getAdditionalUserInfo,
} from 'firebase/auth';
import { auth } from '../firebase';
import { addMultipleTodosToFirestore } from '../utils/api';
import type { Todo } from '../utils/db';

// Component Imports
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import GoogleIcon from '../components/icons/GoogleIcon.vue';
import EyeIcon from '../components/icons/EyeIcon.vue';
import EyeOffIcon from '../components/icons/EyeOffIcon.vue';
import LoaderSpin from '../components/icons/LoaderSpin.vue';

// --- STATE MANAGEMENT ---
const router = useRouter();
const route = useRoute();

const isLogin = ref(route.query.mode !== 'signup');
const isResetMode = ref(false);
const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
const error = ref<string | null>(null);
const loading = ref(false);
const verificationSent = ref(false);
const resetSentMessage = ref<string | null>(null);

// --- HELPER FUNCTIONS ---
const createDummyTasks = async (user: User) => {
    const dummyTodos: Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>[] = [
        { title: "Welcome to your new Vue to-do list!", completed: false, priority: "medium", userId: 1 },
        { title: "Click the pencil icon to edit this task", completed: false, priority: "low", userId: 1 },
        { title: "Click the checkbox to mark a task as complete", completed: true, priority: "low", userId: 1 },
        { title: "Use the 'AI Assistant' to generate new tasks", completed: false, priority: "high", userId: 1 },
    ];
    await addMultipleTodosToFirestore(user.uid, dummyTodos);
};

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password: string) => password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);

const clearState = () => {
  error.value = null;
  resetSentMessage.value = null;
  verificationSent.value = false;
};

// --- EVENT HANDLERS ---
const handleEmailSubmit = async () => {
  clearState();
  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email address.';
    return;
  }
  if (!isLogin.value && !validatePassword(password.value)) {
    error.value = 'Password must be at least 8 characters long and include numbers and letters.';
    return;
  }
  if (!isLogin.value && (!firstName.value.trim() || !lastName.value.trim())) {
    error.value = 'First and last name are required.';
    return;
  }
  loading.value = true;
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      router.push('/todos');
    } else {
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      await updateProfile(user, { displayName: `${firstName.value.trim()} ${lastName.value.trim()}` });
      await createDummyTasks(user);
      await sendEmailVerification(user);
      verificationSent.value = true;
    }
  } catch (err) {
    error.value = (err as AuthError).message;
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  loading.value = true;
  clearState();
  try {
    const result = await signInWithPopup(auth, new GoogleAuthProvider());
    const additionalInfo = getAdditionalUserInfo(result);
    if (additionalInfo?.isNewUser) {
      await createDummyTasks(result.user);
    }
    router.push('/todos');
  } catch (err) {
    error.value = (err as AuthError).message;
  } finally {
    loading.value = false;
  }
};

const handlePasswordReset = async () => {
  clearState();
  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email to reset your password.';
    return;
  }
  loading.value = true;
  try {
    await sendPasswordResetEmail(auth, email.value);
    resetSentMessage.value = 'Password reset link sent! Please check your inbox.';
  } catch (err) {
    error.value = (err as AuthError).message;
  } finally {
    loading.value = false;
  }
};

const toggleAuthMode = () => {
  const newIsLogin = !isLogin.value;
  isLogin.value = newIsLogin;
  clearState();
  router.push(newIsLogin ? '/login' : '/login?mode=signup');
};

watch(() => route.query.mode, (newMode) => {
  isLogin.value = newMode !== 'signup';
});
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-900">
    <div v-if="verificationSent" class="mx-auto grid w-full max-w-[350px] gap-6 text-center">
      <div class="flex justify-center">
        <h2 class="text-2xl font-bold tracking-tight text-indigo-600">MyTodoApp</h2>
      </div>
      <div>
        <h1 class="text-3xl font-bold dark:text-white">Verify Your Email</h1>
        <p class="text-balance text-gray-500 dark:text-gray-400">
          We've sent a verification link to <strong>{{ email }}</strong>. Please check your inbox.
        </p>
      </div>
      <Button variant="outline" @click="verificationSent = false; isLogin = true; router.push('/login')">
        Back to Login
      </Button>
    </div>
    <div v-else class="w-full h-full lg:grid lg:grid-cols-2">
      <div class="hidden bg-gray-100 dark:bg-slate-900 lg:block">
        <div 
          class="h-full w-full object-cover" 
          :style="{
            backgroundImage: `url('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }"
        />
      </div>
      <div class="flex items-center justify-center py-12 px-6 min-h-screen">
        <div class="mx-auto grid w-full max-w-[350px] gap-6">
          <div class="flex justify-center">
            <h2 class="text-2xl font-bold tracking-tight text-indigo-600">MyTodoApp</h2>
          </div>
          
          <div v-if="isResetMode">
            <div class="grid gap-2 text-center">
              <h1 class="text-3xl font-bold dark:text-white">Reset Password</h1>
              <p class="text-balance text-gray-500 dark:text-gray-400">
                Enter your email to get a reset link.
              </p>
            </div>
            <div class="grid gap-4">
               <Input v-model="email" id="email" type="email" placeholder="m@example.com" required :disabled="loading" />
               <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
               <p v-if="resetSentMessage" class="text-sm text-green-600 text-center">{{ resetSentMessage }}</p>
               <Button @click="handlePasswordReset" class="w-full" :disabled="loading">
                  <LoaderSpin v-if="loading" class="mr-2" />
                  Send Reset Link
               </Button>
            </div>
             <div class="mt-4 text-center text-sm">
              <button @click="isResetMode = false" class="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  Back to Login
              </button>
            </div>
          </div>
          
          <div v-else>
            <div class="grid gap-2 text-center">
              <h1 class="text-3xl font-bold dark:text-white">
                {{ isLogin ? 'Welcome Back!' : 'Create an Account' }}
              </h1>
              <p class="text-balance text-gray-500 dark:text-gray-400">
                {{ isLogin ? "Enter your email below to login" : "Enter your info to create an account" }}
              </p>
            </div>
            <form @submit.prevent="handleEmailSubmit" class="grid gap-4">
              <div v-if="!isLogin" class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <label for="first-name" class="dark:text-gray-200">First Name</label>
                  <Input v-model="firstName" id="first-name" type="text" placeholder="John" required :disabled="loading" />
                </div>
                <div class="grid gap-2">
                  <label for="last-name" class="dark:text-gray-200">Last Name</label>
                  <Input v-model="lastName" id="last-name" type="text" placeholder="Doe" required :disabled="loading" />
                </div>
              </div>
              <div class="grid gap-2">
                <label for="email" class="dark:text-gray-200">Email</label>
                <Input v-model="email" id="email" type="email" placeholder="m@example.com" required :disabled="loading" />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <label for="password" class="dark:text-gray-200">Password</label>
                  <button v-if="isLogin" type="button" @click="isResetMode = true" class="ml-auto inline-block text-sm text-indigo-600 hover:underline dark:text-indigo-400">
                      Forgot password?
                  </button>
                </div>
                <div class="relative">
                  <Input v-model="password" id="password" :type="isPasswordVisible ? 'text' : 'password'" placeholder="********" required :disabled="loading" />
                  <button type="button" @click="isPasswordVisible = !isPasswordVisible" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600">
                    <EyeOffIcon v-if="isPasswordVisible" />
                    <EyeIcon v-else />
                  </button>
                </div>
              </div>
              
              <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>
              
              <Button type="submit" class="w-full" :disabled="loading">
                <LoaderSpin v-if="loading" class="mr-2" />
                {{ isLogin ? 'Login' : 'Create Account' }}
              </Button>
              <Button variant="outline" class="w-full" @click="handleGoogleSignIn" :disabled="loading">
                <GoogleIcon />
                {{ isLogin ? 'Login with Google' : 'Sign up with Google' }}
              </Button>
            </form>
            <div class="mt-4 text-center text-sm dark:text-gray-300">
              {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
              <button @click="toggleAuthMode" class="font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                {{ isLogin ? 'Sign up' : 'Sign in' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

