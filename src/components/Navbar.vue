<script setup>
import { ref } from "vue";
import images from "@/assets/images.ts"
const isOpen = ref(false);
</script>

<template>
  <nav class="relative bg-white dark:bg-gray-800">
    <div class="container px-6 py-4 mx-auto">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="flex items-center justify-between">
          <a href="#">
            <img  class="w-auto max-h-[25px] sm:max-h-[35px]"  :src="images.logo" alt="Logo" />
          </a>

          <!-- Mobile Menu Button -->
          <div class="flex lg:hidden">
            <MazBtn
              @click="isOpen = !isOpen"
              size="md"
              class="text-gray-500 dark:text-gray-200"
              variant="link"
            >
              <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </MazBtn>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div
          :class="{ 'translate-x-0 opacity-100': isOpen, 'opacity-0 -translate-x-full': !isOpen }"
          class="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center"
        >
          <div class="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
            <a href="/dashboard" class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Home</a>
            <a href="/dashboard/categories" class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Category</a>
            <a href="/dashboard/ingredients" class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">ingredients</a>
            <a href="/dashboard/help" class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Help</a>
          </div>

          <div class="flex items-center mt-4 lg:mt-0">
            <MazAvatar src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80"
              fallback-src="https://api.dicebear.com/7.x/big-smile/svg?backgroundColor=1d90ff&scale=80&seed=100"
              loading="eager"
              size="12px" />
            
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
