<script setup>
import { ref } from "vue";
import images from "@/assets/images.ts";
import {
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { useToast } from "maz-ui";
import { useLogout } from "@/stores/apiStore"; // ✅ TanStack Mutation

const isOpen = ref(false);
const toast = useToast();
const logoutMutation = useLogout(); // ✅ Mutation for logout

const icons = {
  user: UserIcon,
  cog: Cog6ToothIcon,
  logout: ArrowRightOnRectangleIcon,
};

const handleLogout = async () => {
  try {
    await logoutMutation.mutateAsync(); // ✅ TanStack mutation call
    toast.info("You have logged out successfully!", { color: "blue", timeout: 1000 });

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  } catch (error) {
    toast.error("Logout failed. Try again!", { timeout: 2000 });
  }
};

const dropdownItems = [
  { label: "Profile", icon: "user", href: "/profile" },
  { label: "Settings", icon: "cog", href: "/settings" },
  { label: "Logout", icon: "logout", action: handleLogout },
];
</script>

<template>
  <nav class="relative bg-white">
    <div class="container px-6 py-4 mx-auto">
      <div class="lg:flex lg:items-center lg:justify-between">
        <!-- Logo & Mobile Menu Toggle -->
        <div class="flex items-center justify-between">
          <a href="#">
            <img
              class="w-auto max-h-[25px] sm:max-h-[35px]"
              :src="images.logo"
              alt="Logo"
            />
          </a>

          <div class="flex lg:hidden">
            <MazBtn
              @click="isOpen = !isOpen"
              size="md"
              class="text-gray-500"
              variant="link"
            >
              <svg
                v-if="!isOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </MazBtn>
          </div>
        </div>

        <!-- Navigation Menu -->
        <div
          :class="{ 'translate-x-0 opacity-100': isOpen, 'opacity-0 -translate-x-full': !isOpen }"
          class="absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center"
        >
          <div class="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
            <a
              href="/dashboard"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-gray-100"
              >Home</a
            >
            <a
              href="/dashboard/categories"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-gray-100"
              >Category</a
            >
            <a
              href="/dashboard/ingredients"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-gray-100"
              >Ingredients</a
            >
            <a
              href="/dashboard/help"
              class="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 hover:bg-gray-100"
              >Help</a
            >
          </div>

          <!-- Avatar & Dropdown -->
          <div class="mt-4 lg:mt-0">
            <MazDropdown :items="dropdownItems">
              <template #element>
                <MazAvatar
                  clickable
                  no-clickable-icon
                  class="border-2 border-gray-300 hover:scale-105 transition-transform"
                  src="https://cdn.artphotolimited.com/images/5ff5a529bd40b83c5a537440/1000x1000/gerard-depardieu-1983.jpg"
                  size="12px"
                />
              </template>

              <template #item="{ item }">
                <a
                  v-if="item.href"
                  :href="item.href"
                  class="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <component
                    :is="icons[item.icon]"
                    class="w-5 h-5 text-gray-500"
                  />
                  <span>{{ item.label }}</span>
                </a>

                <button
                  v-else
                  @click="item.action"
                  class="flex items-center gap-2 px-4 py-2 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <component
                    :is="icons[item.icon]"
                    class="w-5 h-5 text-gray-500"
                  />
                  <span>{{ item.label }}</span>
                </button>
              </template>
            </MazDropdown>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
