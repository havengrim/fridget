<script setup>
import { ref, provide } from 'vue';
import Navbar from "@/components/Navbar.vue";

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
  <div class="flex h-screen">
    <div class="flex-1 flex flex-col bg-[var(--maz-bg)] transition-all duration-300">
      <Navbar />
      <div class="p-6 bg-[var(--maz-bg-primary)] rounded-tl-xl h-full">
        <router-view /> <!-- Loads dashboard pages -->
      </div>
    </div>
  </div>
</template>
