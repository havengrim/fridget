<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Left side - Hero Section with Image -->
<div class="hidden lg:flex flex-1 bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-8 relative overflow-hidden" :style="`background-image: url(${images.dashboard}); background-size: cover; background-position: center;`">
  
  <!-- Subtle overlay for better text readability without hiding the robot -->
  <div class="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
  
  <!-- Position text in bottom-left area to avoid covering the robot's face -->
<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-xl bg-white/30 backdrop-blur-sm p-6 rounded-2xl shadow-lg">

    <!-- Hero content -->
   
  </div>
</div>


    <!-- Right side - Login Form -->
    <div class="flex-1 flex items-center justify-center p-4 lg:p-8 bg-white">
      <div class="w-full max-w-md">
        <MazCardSpotlight class="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div class="p-8">
            <div class="text-center mb-8">
              <div class="rounded-xl flex items-center justify-center mx-auto mb-6">
                <img class="w-22 h-10" :src="images.logo" alt="Fridget Logo" />
              </div>
              <h1 class="text-3xl font-bold text-gray-900 mb-3">Welcome Back</h1>
              <p class="text-gray-600 text-sm leading-relaxed">
                Sign in now and discover amazing recipes with your available ingredients.
              </p>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="space-y-2">
                <label for="email" class="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <MazInput
                  v-model="email"
                  type="email"
                  placeholder="example@example.com"
                  class="w-full transition-all duration-200 focus:scale-105"
                  block
                  required
                />
              </div>

              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <label for="password" class="text-sm font-semibold text-gray-700">Password</label>
                  <a href="#" class="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div class="relative">
                  <MazInput
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="Your Password"
                    class="w-full transition-all duration-200 focus:scale-105"
                    block
                    required
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center">
                <input
                  id="remember"
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all"
                >
                <label for="remember" class="ml-2 block text-sm text-gray-600">
                  Remember me for 30 days
                </label>
              </div>

              <div v-if="errorMessage" class="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {{ errorMessage }}
              </div>

              <Maz-btn
                color="secondary"
                class="w-full !m-0 transform transition-all duration-200 hover:scale-105 active:scale-95"
                :loading="isLoading"
                @click="handleSubmit"
                block
              >
                {{ isLoading ? 'Signing in...' : 'Sign in to Fridget' }}
              </Maz-btn>

              <div class="text-center pt-4">
                <p class="text-sm text-gray-600">
                  Don't have an account? 
                  <a href="/signup" class="text-green-600 hover:text-green-800 hover:underline font-semibold transition-colors">
                    Sign up for free
                  </a>
                </p>
              </div>
            </form>
          </div>
        </MazCardSpotlight>

        <div class="mt-8 text-center text-xs text-gray-500">
          © 2024 Fridget Inc. All rights reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useToast } from "maz-ui"
import { useLogin } from "@/stores/apiStore"
import images from "../assets/images"

const email = ref("")
const password = ref("")
const showPassword = ref(false)
const rememberMe = ref(false)
const errorMessage = ref("")
const isLoading = ref(false)

const toast = useToast()
const login = useLogin()

const handleSubmit = () => {
  errorMessage.value = ""
  isLoading.value = true
  
  login.mutate(
    {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value
    },
    {
      onSuccess: (data) => {
        toast.info("Login successful! Redirecting...", {
          timeout: 1000,
          color: "blue"
        })
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 2000)
      },
      onError: (error) => {
        const message = error.message || "Login failed"
        errorMessage.value = message
        toast.error(message, { timeout: 3000 })
      },
      onSettled: () => {
        isLoading.value = false
      }
    }
  )
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Custom animations for better visual appeal */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Smooth transitions for all interactive elements */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>