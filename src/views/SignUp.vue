<template>
    <div class="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-sm sm:max-w-md lg:w-2/6 ml-0 sm:ml-16">
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
                <div>
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">First Name *</label>
                  <MazInput v-model="firstName" type="text" placeholder="John" class="w-full" block required />
                </div>
  
                <div class="mt-4">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">User ID *</label>
                  <MazInput v-model="userId" type="text" placeholder="john_doe" class="w-full" block required />
                </div>
  
                <div class="mt-4">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Password *</label>
                  <MazInput v-model="password" type="password" placeholder="Your Password" class="w-full" block required />
                </div>
  
                <div class="mt-4">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Confirm Password *</label>
                  <MazInput v-model="confirmPassword" type="password" placeholder="Re-enter Password" class="w-full" block required />
                </div>
                <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">Passwords do not match</p>
  
                <div class="mt-6">
                  <label class="block mb-2 text-sm text-gray-600 dark:text-gray-200">Allergies (optional)</label>
                  <div class="flex gap-2">
                    <MazInput v-model="newAllergy" type="text" placeholder="Add Allergy" class="w-full" />
                    <MazBtn @click="addAllergy" color="primary">Add</MazBtn>
                  </div>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <div v-for="(allergy, index) in allergies" :key="index" class="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full">
                      {{ allergy }}
                      <button @click="removeAllergy(index)" class="ml-2 text-white text-sm">✕</button>
                    </div>
                  </div>
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
                  <Maz-btn color="primary" class="w-full" type="submit" block>Sign Up</Maz-btn>
                </div>
                
                <div class="mt-4 text-center">
                  <p class="text-sm text-gray-600 dark:text-gray-200">Already have an account? <a href="/" class="text-blue-500">Log in</a></p>
                </div>
              </form>
            </div>
          </div>
        </MazCardSpotlight>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import images from '../assets/images';
  
  const firstName = ref('');
  const userId = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const newAllergy = ref('');
  const allergies = ref([]);
  const spiciness = ref(1);
  const agreeTerms = ref(false);
  
  const passwordMismatch = computed(() => password.value !== confirmPassword.value && confirmPassword.value !== '');
  
  const addAllergy = () => {
    if (newAllergy.value.trim()) {
      allergies.value.push(newAllergy.value.trim());
      newAllergy.value = '';
    }
  };
  
  const removeAllergy = (index) => {
    allergies.value.splice(index, 1);
  };
  
  const handleSubmit = () => {
    if (!agreeTerms.value) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    if (passwordMismatch.value) {
      alert('Passwords do not match!');
      return;
    }
    console.log({
      firstName: firstName.value,
      userId: userId.value,
      password: password.value,
      allergies: allergies.value,
      spiciness: spiciness.value,
      agreeTerms: agreeTerms.value
    });
  };
  </script>
