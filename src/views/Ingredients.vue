<template>
  <div class="container mx-auto p-6">
    <div class="flex flex-col gap-4">
      <h1 class="font-bold text-2xl sm:text-4xl mt-6">My Ingredients</h1>

      <!-- Input Section -->
      <div class="flex flex-col sm:flex-row gap-2 w-full">
        <MazInputTags v-model="newIngredient" label="Enter Ingredient" class="w-full" />

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
          class="p-4 border border-gray-300 rounded-lg shadow-md"
        >
          <h2 class="font-semibold text-lg border-b pb-2 mb-2">{{ category }}</h2>
          <ul class="space-y-2">
            <li v-if="items.length === 0" class="text-gray-500 text-sm">
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
import { ref, computed } from "vue"
import { useToast } from "maz-ui"
import { TrashIcon } from "@heroicons/vue/24/outline"
import { useQueryClient } from "@tanstack/vue-query"
import { useIngredients, useAddIngredient, useDeleteIngredient } from "@/stores/apiStore" 

const toast = useToast()
const queryClient = useQueryClient()

const newIngredient = ref([])  // Array to store the new ingredients
const selectedCategory = ref(null)
const showDialog = ref(false)
const categoryToDelete = ref("")
const indexToDelete = ref(null)

const categories = ref([
  { label: "Vegetables", value: "Vegetables" },
  { label: "Fruits", value: "Fruits" },
  { label: "Dairy", value: "Dairy" },
  { label: "Meat", value: "Meat" },
])

// TanStack queries & mutations
const { data: ingredients, isLoading } = useIngredients()
const addIngredientMutation = useAddIngredient()
const deleteIngredientMutation = useDeleteIngredient()

const categorizedIngredients = computed(() => ingredients.value || {})

const addIngredient = async () => {
  const ingredientsList = [...newIngredient.value]; // Ensure it's a plain array

  if (!ingredientsList.length || !selectedCategory.value) {
    toast.error("Please enter ingredient(s) and select a category.");
    return;
  }

  try {
    // Loop through and send each one individually
    for (const name of ingredientsList) {
      await addIngredientMutation.mutateAsync({
        name,
        category: selectedCategory.value,
      });
    }

    toast.success(`Added ${ingredientsList.join(", ")} to ${selectedCategory.value}!`);
    newIngredient.value = [];
    selectedCategory.value = null;
    queryClient.invalidateQueries({ queryKey: ["ingredients"] });
  } catch (err) {
    toast.error(err.message || "Error adding ingredients");
  }
};



const confirmDelete = (category, index) => {
  categoryToDelete.value = category
  indexToDelete.value = index
  showDialog.value = true
}

const deleteIngredient = async () => {
  try {
    await deleteIngredientMutation.mutateAsync({
      category: categoryToDelete.value,
      index: indexToDelete.value,
    })
    toast.success("Ingredient deleted!")  // Use success toast instead of error for deletion
    queryClient.invalidateQueries({ queryKey: ["ingredients"] })
  } catch (err) {
    toast.error("Failed to delete ingredient")
  } finally {
    showDialog.value = false  // Close the dialog after operation
  }
}
</script>
