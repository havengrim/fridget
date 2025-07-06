<template>
  <div class="bg-white min-h-screen flex  mt-10 justify-center p-4">
    <div class="w-full max-w-md sm:max-w-6xl lg:w-full">
      <div>
        <div class="p-4 sm:p-6">
          <div class="text-center mb-8">
            <div class="flex flex-col items-center">
              <img class="w-24 sm:w-24 h-auto" :src="images.logo" alt="Fridget Logo" />
            </div>
            <p class="mt-3 text-gray-500 text-sm sm:text-base text-center">
              Sign up now and start discovering recipes based on your ingredients.
            </p>
          </div>

          <MazStepper auto-validate-steps>
            <!-- Step 1: Basic Information -->
            <template #title-1>
              Basic Information
            </template>
            <template #subtitle-1>
              Enter your basic account details
            </template>
            <template #title-info-1>
              Required
            </template>
            <template #content-1="{ nextStep }">
              <form @submit.prevent="nextStep">
                <!-- Row 1: First Name & User ID -->
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="w-full sm:w-1/2">
                    <label class="block mb-2 text-sm text-gray-600">First Name *</label>
                    <MazInput v-model="firstName" type="text" placeholder="John" class="w-full" block required />
                  </div>
                  <div class="w-full sm:w-1/2">
                    <label class="block mb-2 text-sm text-gray-600">User ID *</label>
                    <MazInput v-model="userId" type="text" placeholder="john_doe" class="w-full" block required />
                  </div>
                </div>
                
                <!-- Row 2: Password & Confirm Password -->
                <div class="flex flex-col sm:flex-row gap-4 mt-4">
                  <div class="w-full sm:w-1/2">
                    <label class="block mb-2 text-sm text-gray-600">Password *</label>
                    <MazInput v-model="password" type="password" placeholder="Your Password" class="w-full" block required />
                  </div>
                  <div class="w-full sm:w-1/2">
                    <label class="block mb-2 text-sm text-gray-600">Confirm Password *</label>
                    <MazInput v-model="confirmPassword" type="password" placeholder="Re-enter Password" class="w-full" block required />
                  </div>
                </div>
                <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">Passwords do not match</p>
                
                <div class="mt-6">
                  <MazBtn type="submit" color="primary" class="w-full">
                    Continue to Dietary Preferences
                  </MazBtn>
                </div>
              </form>
            </template>

            <!-- Step 2: Dietary Preferences -->
            <template #title-2>
              Dietary Preferences
            </template>
            <template #subtitle-2>
              Tell us about your dietary preferences
            </template>
            <template #title-info-2>
              {{ allergies.length }} allergies added
            </template>
            <template #content-2="{ nextStep, previousStep }">
              <!-- Allergies -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600">Allergies (optional)</label>
                <div class="flex items-center gap-2 w-full">
                  <MazInput v-model="newAllergy" type="text" placeholder="Add Allergy" block/>
                  <MazBtn @click="addAllergy" color="primary" class="px-3 py-[10px]">Add</MazBtn>
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
                <label class="block mb-2 text-sm text-gray-600">Meat Consumption *</label>
                <MazRadioButtons v-model="meatConsumption" :options="consumptionOptions" name="meatConsumption" variant="radio" size="sm" block />
              </div>

              <!-- Fish Consumption -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600">Fish Consumption *</label>
                <MazRadioButtons v-model="fishConsumption" :options="consumptionOptions" name="fishConsumption" variant="radio" size="sm" block />
              </div>

              <!-- Vegetable Consumption -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600">Vegetable Consumption *</label>
                <MazRadioButtons v-model="vegetableConsumption" :options="consumptionOptions" name="vegetableConsumption" variant="radio" size="sm" block />
              </div>

              <!-- Spiciness -->
              <div class="mt-6">
                <label class="block mb-2 text-sm text-gray-600">Spiciness *</label>
                <MazSlider v-model="spiciness" :min="1" :max="5" />
              </div>

              <div class="mt-6 flex gap-4">
                <MazBtn @click="previousStep" color="secondary" class="flex-1">
                  Previous
                </MazBtn>
                <MazBtn @click="nextStep" color="primary" class="flex-1">
                  Continue to Review
                </MazBtn>
              </div>
            </template>

            <!-- Step 3: Terms & Submit -->
            <template #title-3>
              Complete Registration
            </template>
            <template #subtitle-3>
              Review and complete your registration
            </template>
            <template #content-3="{ previousStep }">
              <div class="space-y-4">
                <!-- Summary -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h4 class="font-medium text-gray-900 mb-2">Registration Summary</h4>
                  <div class="text-sm text-gray-600 space-y-1">
                    <p><strong>Name:</strong> {{ firstName }}</p>
                    <p><strong>User ID:</strong> {{ userId }}</p>
                    <p><strong>Allergies:</strong> {{ allergies.length > 0 ? allergies.join(', ') : 'None' }}</p>
                    <p><strong>Spiciness Level:</strong> {{ spiciness }}/5</p>
                  </div>
                </div>

                <!-- Terms -->
                <div class="flex items-center">
                  <MazCheckbox v-model="agreeTerms" />
                  <label class="ml-2 text-sm text-gray-600">I agree to the terms and conditions</label>
                </div>

                <!-- Submit -->
                <div class="flex gap-4">
                  <MazBtn @click="previousStep" color="secondary" class="flex-1">
                    Previous
                  </MazBtn>
                  <MazBtn @click="handleSubmit" color="primary" class="flex-1" :loading="loading">
                    Sign Up
                  </MazBtn>
                </div>

                <div class="text-center">
                  <p class="text-sm text-gray-600">
                    Already have an account? <a href="/" class="text-blue-500">Log in</a>
                  </p>
                </div>
              </div>
            </template>
          </MazStepper>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useToast } from "maz-ui"
import { useRegister } from "@/stores/apiStore" 
import images from "../assets/images"

const router = useRouter()
const toast = useToast()

// Form fields
const firstName = ref("")
const userId = ref("")
const password = ref("")
const confirmPassword = ref("")
const newAllergy = ref("")
const allergies = ref([])
const spiciness = ref(1)
const agreeTerms = ref(false)
const meatConsumption = ref("")
const fishConsumption = ref("")
const vegetableConsumption = ref("")
const loading = ref(false)

const passwordMismatch = computed(
  () => password.value !== confirmPassword.value && confirmPassword.value !== ""
)

const addAllergy = () => {
  if (newAllergy.value.trim()) {
    allergies.value.push(newAllergy.value.trim())
    newAllergy.value = ""
  }
}

const removeAllergy = (index) => {
  allergies.value.splice(index, 1)
}

// Use TanStack mutation
const register = useRegister()

const handleSubmit = () => {
  if (!agreeTerms.value) {
    toast.error("You must agree to the terms and conditions.")
    return
  }
  if (passwordMismatch.value) {
    toast.error("Passwords do not match!")
    return
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
  }

  loading.value = true
  register.mutate(formData, {
    onSuccess: () => {
      toast.info("Registration successful! Redirecting...")
      setTimeout(() => {
        router.push("/")
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message || "Failed to register. Please try again.")
    },
    onSettled: () => {
      loading.value = false
    },
  })
}

const consumptionOptions = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Frequently", value: "frequently" },
  { label: "Daily", value: "daily" },
]
</script>
