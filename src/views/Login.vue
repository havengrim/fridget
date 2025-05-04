<template>
  <div class="bg-white min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm sm:max-w-md lg:w-2/6 ml-0 sm:ml-16">
      <MazCardSpotlight>
        <div class="p-4 sm:p-6">
          <div class="text-center">
            <div class="flex flex-col items-center">
              <img class="w-24 sm:w-24 h-auto" :src="images.logo" alt="Fridget Logo" />
            </div>
            <p class="mt-3 text-gray-500 text-sm sm:text-base text-center">
              Sign in now and discover recipes with your available ingredients.
            </p>
          </div>

          <div class="mt-8">
            <form @submit.prevent="handleSubmit">
              <div>
                <label for="email" class="block mb-2 text-sm text-gray-600">Email Address</label>
                <MazInput v-model="email" type="email" placeholder="example@example.com" class="w-full" block />
              </div>

              <div class="mt-6">
                <div class="flex justify-between mb-2">
                  <label for="password" class="text-sm text-gray-600">Password</label>
                  <a href="#" class="text-sm text-gray-400 hover:text-blue-500 hover:underline">Forgot password?</a>
                </div>
                <MazInput v-model="password" type="password" placeholder="Your Password" class="w-full" block />
              </div>

              <div v-if="errorMessage" class="mt-3 text-red-500 text-sm text-center">
                {{ errorMessage }}
              </div>

              <div class="mt-6">
                <Maz-btn color="primary" class="w-full" @click="handleSubmit" block>Sign in</Maz-btn>
              </div>
              <div class="mt-4 text-center">
                <p class="text-sm text-gray-600">
                  Don't have an account? <a href="/signup" class="text-blue-500">Sign up</a>
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
import { ref, watch } from "vue"
import { useToast } from "maz-ui"
import { useLogin } from "@/stores/apiStore" 
import images from "../assets/images"

const email = ref("")
const password = ref("")
const errorMessage = ref("")

const toast = useToast()
const login = useLogin()

const handleSubmit = () => {
  errorMessage.value = "" // clear previous error

  login.mutate(
    { email: email.value, password: password.value },
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
      }
    }
  )
}
</script>
