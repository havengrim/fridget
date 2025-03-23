<template>
    <div class="container mx-auto p-6">
      <div class="flex flex-col gap-4">
        <h1 class="font-bold text-2xl sm:text-4xl mt-6">My Ingredients</h1>
  
        <!-- Input Section -->
        <div class="flex flex-col sm:flex-row gap-2 w-full">
            <MazInputTags 
                v-model="newIngredient"
                label="Enter Ingredient"
                color="primary"
                size="sm"
                class="flex-1 w-full cursor-text"
                />

  
          <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <!-- Category Select -->
            <MazSelect
              v-model="selectedCategory"
              label="Select Category"
              :options="categories"
              search
              class="w-auto sm:w-60"
            />
  
            <!-- Add Button -->
            <MazBtn class="w-auto sm:w-40" @click="addIngredient">
              Add
            </MazBtn>
          </div>
        </div>
  
        <!-- Ingredients Display Section -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <MazCard 
            v-for="(items, category) in categorizedIngredients" 
            :key="category"
            class="p-4 !border !border-gray-300 rounded-lg !shadow-none"
          >
            <h2 class="font-semibold text-lg border-b pb-2 mb-2">{{ category }}</h2>
            <ul class="space-y-2">
              <li v-if="items.length === 0" class="text-gray-500  text-sm">
                No ingredients added yet
              </li>
              <li 
                v-for="(item, index) in items" 
                :key="index" 
                class="flex items-center justify-between bg-gray-100 text-gray-800 px-3 py-2 rounded-lg"
              >
                <span class="font-medium text-sm">{{ item }}</span>
                <MazBtn 
                  size="xs" 
                  color="danger" 
                  class="transition-all hover:bg-red-600 hover:text-white p-1 rounded-md"
                  @click="confirmDelete(category, index)"
                >
                  <TrashIcon class="w-5 h-5" />
                </MazBtn>
              </li>
            </ul>
          </MazCard>
        </div>
      </div>
  
      <!-- Delete Confirmation Dialog -->
      <MazDialog v-model="showDialog" title="Confirm Delete">
        <p>Are you sure you want to remove this ingredient?</p>
        <template #footer>
          <MazBtn size="sm" color="neutral" @click="showDialog = false">Cancel</MazBtn>
          <MazBtn size="sm" color="danger" @click="deleteIngredient">Delete</MazBtn>
        </template>
      </MazDialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { TrashIcon } from "@heroicons/vue/24/outline";
  
  const newIngredient = ref([]);
  const selectedCategory = ref(null);
  const categories = ref([
    { label: "Vegetables", value: "Vegetables" },
    { label: "Fruits", value: "Fruits" },
    { label: "Dairy", value: "Dairy" },
    { label: "Meat", value: "Meat" }
  ]);
  
  // Default ingredients
  const ingredients = ref({
    Vegetables: ["Carrot", ],
    Fruits: ["Apple", "Banana"],
    Dairy: ["Milk", "Cheese"],
    Meat: ["Chicken"]
  });
  
  const showDialog = ref(false);
  const deleteCategory = ref(null);
  const deleteIndex = ref(null);
  
  // Computed property to group ingredients by category
  const categorizedIngredients = computed(() => ingredients.value);
  
  // Add ingredient to category
  const addIngredient = () => {
    if (!newIngredient.value.length || !selectedCategory.value) return;
  
    if (!ingredients.value[selectedCategory.value]) {
      ingredients.value[selectedCategory.value] = [];
    }
    
    ingredients.value[selectedCategory.value].push(...newIngredient.value);
    newIngredient.value = [];
    selectedCategory.value = null;
  };
  
  // Show delete confirmation dialog
  const confirmDelete = (category, index) => {
    deleteCategory.value = category;
    deleteIndex.value = index;
    showDialog.value = true;
  };
  
  // Delete ingredient
  const deleteIngredient = () => {
    if (deleteCategory.value !== null && deleteIndex.value !== null) {
      ingredients.value[deleteCategory.value].splice(deleteIndex.value, 1);
    }
    showDialog.value = false;
  };
  </script>
  