<script setup>
import { ref, provide } from 'vue';
import Navbar from "@/components/Navbar.vue";
import Footer from '@/components/Footer.vue';
// Sidebar collapsed state
const collapsed = ref(false);
const toggleSidebar = () => {
  collapsed.value = !collapsed.value;
};

// Provide the state and function to child components
provide('collapsed', collapsed);
provide('toggleSidebar', toggleSidebar);
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex-1 flex flex-col transition-all duration-300">
      <Navbar />
      <div class="flex-1 p-6">
        <router-view /> <!-- Loads dashboard pages -->
      </div>
      <Footer class="mt-auto"/>
    </div>
  </div>
</template>
