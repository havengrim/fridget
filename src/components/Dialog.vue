<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/20 px-4"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[95vh] relative transform transition-all duration-300 ease-out"
    >
      <!-- Close Button -->
      <button
        class="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-200 group"
        @click="$emit('close')"
      >
        <X class="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
      </button>

      <!-- Scrollable Content -->
      <div class="overflow-y-auto max-h-[95vh]">
        <!-- Hero Section with Image -->
        <div class="relative">
          <img
            v-if="recipe?.image"
            :src="recipe.image"
            :alt="recipe.title"
            class="w-full h-64 sm:h-80 object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-16">
            <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight">
              {{ recipe?.title }}
            </h1>
            <p class="text-white/90 text-lg leading-relaxed">
              {{ recipe?.description }}
            </p>
          </div>
        </div>

        <!-- Content Section -->
        <div class="p-8">
          <!-- Recipe Info Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div class="flex items-center mb-2">
                <Globe class="w-5 h-5 text-blue-600 mr-2" />
                <span class="font-semibold text-blue-900">Cuisine</span>
              </div>
              <p class="text-blue-800 font-medium">{{ recipe?.cuisine }}</p>
            </div>
            
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
              <div class="flex items-center mb-2">
                <BarChart3 class="w-5 h-5 text-green-600 mr-2" />
                <span class="font-semibold text-green-900">Difficulty</span>
              </div>
              <p class="text-green-800 font-medium">{{ recipe?.difficulty }}</p>
            </div>
            
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
              <div class="flex items-center mb-2">
                <Clock class="w-5 h-5 text-orange-600 mr-2" />
                <span class="font-semibold text-orange-900">Time</span>
              </div>
              <p class="text-orange-800 font-medium">{{ recipe?.estimated_time }}</p>
            </div>
          </div>

          <!-- Ingredients Section -->
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <ShoppingCart class="w-6 h-6 text-gray-700 mr-3" />
              <h2 class="text-2xl font-bold text-gray-900">Ingredients</h2>
            </div>
            <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <ul class="space-y-3">
                <li 
                  v-for="(ingredient, i) in recipe?.ingredients_used" 
                  :key="i"
                  class="flex items-start"
                >
                  <div class="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span class="text-gray-700 leading-relaxed">{{ ingredient }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Instructions Section -->
          <div class="mb-8">
            <div class="flex items-center mb-4">
              <ChefHat class="w-6 h-6 text-gray-700 mr-3" />
              <h2 class="text-2xl font-bold text-gray-900">Instructions</h2>
            </div>
            <div class="space-y-4">
              <div 
                v-for="(step, i) in recipe?.how_to_cook" 
                :key="i"
                class="flex items-start bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                  {{ i + 1 }}
                </div>
                <p class="text-gray-700 leading-relaxed">{{ step }}</p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              class="sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Globe, BarChart3, Clock, ShoppingCart, ChefHat, BookOpen, Share2 } from 'lucide-vue-next'

defineProps({
  open: Boolean,
  recipe: Object,
})

defineEmits(['close'])
</script>