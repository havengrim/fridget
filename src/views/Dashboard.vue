<template>
  <div class="container mx-auto p-0 sm:p-6">
    <!-- Title -->
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

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="text-center mt-14 flex flex-col items-center justify-center space-y-4">
      <MazSpinner size="60" color="primary" />
      <span class="text-gray-600">Loading recipes...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center text-red-500 mt-10">
      Failed to load recipes.
    </div>

    <!-- Recipe Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <MazCard
        v-for="(recipe, index) in filteredRecipes"
        :key="recipe.id"
        class="overflow-hidden !p-0 !shadow-none hover:scale-105 hover:cursor-pointer transition-transform duration-300"
        data-aos="fade-up"
        :data-aos-delay="index * 200"
        @click="openDialog(recipe)"
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

    <!-- Custom Dialog -->
    <RecipeDialog :open="isDialogOpen" :recipe="selectedRecipe" @close="closeDialog" />
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { useGetRecipes } from '@/stores/apiStore'
import RecipeDialog from '@/components/Dialog.vue'

const recipes = ref([])
const selectedRecipe = ref(null)
const isDialogOpen = ref(false)
const searchQuery = ref("")

const { data: aiRecipesRaw, isLoading, error } = useGetRecipes()

watchEffect(() => {
  if (aiRecipesRaw.value && !isLoading.value && !error.value) {
    recipes.value = aiRecipesRaw.value.map((dish, i) => ({
      id: i + 1,
      title: dish.name,
      description: dish.description,
      image: dish.image_url,
      ingredients_used: dish.ingredients_used,
      cuisine: dish.cuisine,
      difficulty: dish.difficulty,
      estimated_time: dish.estimated_time,
      how_to_cook: dish.how_to_cook || [],
    }))
  }
})

// Filtered recipes based on search input
const filteredRecipes = computed(() => {
  if (!searchQuery.value) return recipes.value
  return recipes.value.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function openDialog(recipe) {
  selectedRecipe.value = recipe
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
  selectedRecipe.value = null
}

onMounted(() => {
  AOS.init({
    easing: 'ease-out-cubic',
    once: false,
  })
})
</script>
