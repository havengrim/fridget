// src/lib/utils.ts

// Replace this with your actual API URL
export const API_URL = import.meta.env.VITE_API_URL; 

// Get token logic (You can adjust this to your actual logic)
export const getToken = () => {
  return localStorage.getItem("auth_token") || ""; // Example token fetch logic
};
