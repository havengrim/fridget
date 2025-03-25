<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm sm:max-w-2xl lg:w-full">
      <MazCardSpotlight>
        <div class="p-4 sm:p-6">
          <div class="text-center">
            <div class="flex flex-col items-center">
              <img class="w-24 sm:w-24 h-auto" :src="images.logo" alt="Fridget Logo" />
            </div>
            <p class="mt-3 text-gray-500 dark:text-gray-300 text-sm sm:text-base text-center">
              Sign up now and start discovering recipes based on your ingredients.
            </p>
          </div>

          <div class="mt-8">
            <form @submit.prevent="handleSubmit">
              
              <!-- Row 1: First Name & User ID -->
              <div class="flex flex-col sm:flex-row gap-4">
                <div class="w-full sm:w-1/2">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">First Name *</label>
                  <MazInput v-model="firstName" type="text" placeholder="John" class="w-full" block required />
                </div>
                <div class="w-full sm:w-1/2">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">User ID *</label>
                  <MazInput v-model="userId" type="text" placeholder="john_doe" class="w-full" block required />
                </div>
              </div>

              <!-- Row 2: Password & Confirm Password -->
              <div class="flex flex-col sm:flex-row gap-4 mt-4">
                <div class="w-full sm:w-1/2">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password *</label>
                  <MazInput v-model="password" type="password" placeholder="Your Password" class="w-full" block required />
                </div>
                <div class="w-full sm:w-1/2">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Confirm Password *</label>
                  <MazInput v-model="confirmPassword" type="password" placeholder="Re-enter Password" class="w-full" block required />
                </div>
              </div>
              <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">Passwords do not match</p>

              <!-- Other Fields Below -->
              <div class="mt-6 ">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Allergies (optional)</label>
                <div class="flex items-center gap-2 w-full"> <!-- Reduced gap -->
                  <MazInput v-model="newAllergy" type="text" placeholder="Add Allergy" block/>
                  <MazBtn @click="addAllergy" color="primary" class="px-3 py-[10px]">Add</MazBtn> <!-- Adjusted padding -->
                </div>
                <div class="mt-2 flex flex-wrap gap-2">
                  <div v-for="(allergy, index) in allergies" :key="index" class="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
                    {{ allergy }}
                    <button @click="removeAllergy(index)" class="ml-2 text-white text-sm">✕</button>
                  </div>
                </div>
              </div>

  <!-- Meat Consumption -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Meat Consumption *</label>
                <MazRadioButtons v-model="meatConsumption" :options="consumptionOptions" name="meatConsumption" variant="radio" size="sm" block />
              </div>

              <!-- Fish Consumption -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Fish Consumption *</label>
                <MazRadioButtons v-model="fishConsumption" :options="consumptionOptions" name="fishConsumption" variant="radio" size="sm" block />
              </div>

              <!-- Vegetable Consumption -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Vegetable Consumption *</label>
                <MazRadioButtons v-model="vegetableConsumption" :options="consumptionOptions" name="vegetableConsumption" variant="radio" size="sm" block />
              </div>


              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Spiciness *</label>
                <MazSlider v-model="spiciness" :min="1" :max="5" />
              </div>

              <div class="mt-6 flex items-center">
                <MazCheckbox v-model="agreeTerms" />
                <label class="ml-2 text-sm text-gray-600 dark:text-gray-200">I agree to the terms and conditions</label>
              </div>

              <div class="mt-6">
                <MazBtn color="primary" class="w-full" type="submit" block>Sign Up</MazBtn>
              </div>

              <div class="mt-4 text-center">
                <p class="text-sm text-gray-600 dark:text-gray-200">
                  Already have an account? <a href="/" class="text-blue-500">Log in</a>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useApiStore } from "../stores/apiStore";
import { useToast } from "maz-ui"; // Import MazToast
import images from "../assets/images";

const apiStore = useApiStore();
const router = useRouter();

const firstName = ref("");
const userId = ref("");
const password = ref("");
const confirmPassword = ref("");
const newAllergy = ref("");
const allergies = ref([]);
const spiciness = ref(1);
const agreeTerms = ref(false);
const meatConsumption = ref("");
const fishConsumption = ref("");
const vegetableConsumption = ref("");
const loading = ref(false);

const toast = useToast();
const passwordMismatch = computed(
  () => password.value !== confirmPassword.value && confirmPassword.value !== ""
);

const addAllergy = () => {
  if (newAllergy.value.trim()) {
    allergies.value.push(newAllergy.value.trim());
    newAllergy.value = "";
  }
};

const removeAllergy = (index) => {
  allergies.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (!agreeTerms.value) {
    toast.error("You must agree to the terms and conditions.");
    return;
  }
  if (passwordMismatch.value) {
    toast.error("Passwords do not match!");
    return;
  }

  const formData = {
    first_name: firstName.value,
    username: userId.value,
    password: password.value,
    allergies: allergies.value,
    spiciness: spiciness.value,
    meat_consumption: meatConsumption.value,
    fish_consumption: fishConsumption.value,
    vegetable_consumption: vegetableConsumption.value,
  };

  try {
    loading.value = true;
    const response = await apiStore.registerUser(formData);

    if (response.success) {
      toast.info("Registration successful! Redirecting...");
      setTimeout(() => {
        router.push("/"); // Redirect after success
      }, 2000);
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    toast.error("Failed to register. Please try again.");
  } finally {
    loading.value = false;
  }
};

const consumptionOptions = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Frequently", value: "frequently" },
  { label: "Daily", value: "daily" },
];
</script>
