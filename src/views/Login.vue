<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm sm:max-w-md lg:w-2/6 ml-0 sm:ml-16">
      <MazCardSpotlight>
        <div class="p-4 sm:p-6">
          <div class="text-center">
            <div class="flex flex-col items-center">
              <img class="w-24 sm:w-24 h-auto" :src="images.logo" alt="Fridget Logo" />
            </div>
            <p class="mt-3 text-gray-500 dark:text-gray-300 text-sm sm:text-base text-center">
              Sign in now and discover recipes with your available ingredients.
            </p>
          </div>

          <div class="mt-8">
            <form @submit.prevent="handleSubmit">
              <div>
                <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
                <MazInput v-model="email" type="email" placeholder="example@example.com" class="w-full" block />
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label for="password" class="text-sm text-gray-600 dark:text-gray-200">Password</label>
                  <a href="#" class="text-sm text-gray-400 hover:text-blue-500 hover:underline">Forgot password?</a>
                </div>
                <MazInput v-model="password" type="password" placeholder="Your Password" class="w-full" block />
              </div>

              <div v-if="errorMessage" class="mt-3 text-red-500 text-sm text-center">
                {{ errorMessage }}
              </div>

              <div class="mt-6">
                <Maz-btn color="primary" class="w-full" @click="handleSubmit" block>Sign in</Maz-btn>
              </div>
              <div class="mt-4 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-200">
                  Don't have an account? <a href="/signup" class="text-blue-500">Sign up</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </MazCardSpotlight>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import images from '../assets/images'; // Ensure the path is correct

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';

  try {
    const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email.value, // Change this to "email" if Django uses email authentication
        password: password.value,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      window.location.href = '/dashboard'; // Redirect to dashboard after login
    } else {
      errorMessage.value = data.error || 'Invalid credentials';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = 'Something went wrong. Please try again.';
  }
};
</script>
