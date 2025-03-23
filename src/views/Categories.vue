<template>
    <div class="flex flex-col items-center justify-center h-full text-center">

        <img :src="images.cooking" alt="Cooking in progress" class="w-60 sm:w-80 mb-4" />
  
      <!-- Page Title -->
      <h1 class="text-3xl sm:text-4xl font-bold mt-4 text-gray-800">
        We're Still Cooking This Page!
      </h1>
  
      <!-- Description -->
      <p class="text-gray-600 text-lg mt-2 max-w-lg">
      Fridget is almost ready. Soon, you'll be able to create meals with what’s in your fridge.
    </p>
  
    </div>
  </template>
  
<script setup>
import images from '@/assets/images';

</script>