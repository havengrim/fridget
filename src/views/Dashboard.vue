<template>
  <div class="container mx-auto p-0 sm:p-6">
    <!-- Title & Search -->
    <div class="flex flex-col items-center justify-between text-center">
      <h1 class="font-bold text-2xl sm:text-4xl mt-14">What are you cooking today?</h1>

      <!-- Search Input -->
      <div class="w-full max-w-xl mt-6">
        <MazInput 
          v-model="searchQuery" 
          placeholder="Search for a recipe..." 
          class="w-full"
          block
          rounded-size="full"
        >
          <template #prepend-inner>
            <MagnifyingGlassIcon class="w-5 h-5 text-gray-500 mx-2" />
          </template>
        </MazInput>
      </div>
    </div>

    <!-- Recipe Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <MazCard 
          v-for="(recipe, index) in recipes" 
          :key="recipe.id" 
          class="overflow-hidden !p-0 !shadow-none hover:scale-105 hover:cursor-pointer transition-transform duration-300"

          data-aos="fade-up"
          :data-aos-delay="index * 200" 
        >
        <img 
          :src="recipe.image" 
          :alt="recipe.title" 
          class="w-full h-40 object-cover rounded-t-lg" 
        />
        <div class="!p-0">
          <h3 class="font-semibold text-lg mt-2">{{ recipe.title }}</h3>
          <p class="text-gray-500 text-sm mt-2">{{ recipe.description }}</p>
        </div>
      </MazCard>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import images from "@/assets/images.ts";

const searchQuery = ref("");

const recipes = ref([
  { id: 1, title: "Pasta Carbonara", description: "A classic Italian pasta dish with creamy sauce.", image: images.pasta },
  { id: 2, title: "Avocado Toast", description: "Healthy and delicious toast topped with avocado.", image: images.avocado },
  { id: 3, title: "Grilled Salmon", description: "Juicy salmon grilled to perfection.", image: images.salmon },
  { id: 4, title: "Chocolate Cake", description: "Rich and moist chocolate cake for dessert.", image: images.chocolate },
]);

onMounted(() => {
  AOS.init({
    easing: "ease-out-cubic", 
    once: false, 
  });
});

</script>
