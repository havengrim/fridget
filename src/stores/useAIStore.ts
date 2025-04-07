import { useQuery } from "@tanstack/vue-query";

// API URL
const API_URL = 'http://127.0.0.1:8000/api/auth';

// Function to get token from localStorage
const getToken = () => localStorage.getItem("auth_token") || "";

// The main useQuery hook for AI recipes
export const useAIRecipes = () => {
  return useQuery({
    queryKey: ['ai-recipes'],
    queryFn: async () => {
      const token = getToken();  // Retrieve token from localStorage

      // Debugging: Log the token to ensure it exists
      console.log("Token being sent:", token);

      // If token is missing, throw an error
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      try {
        // Make API request with Authorization header
        const res = await fetch(`${API_URL}/recipes/ai/`, {
          headers: {
            Authorization: `Token ${token}`, // or `Bearer ${token}` if required by the API
          },
        });

        // Debugging: Log the raw response text to understand what's being returned
        const rawData = await res.text();  // Capture raw response as string
        console.log('Raw Response:', rawData);

        // Try to parse the response as JSON
        let data;
        try {
          data = JSON.parse(rawData);  // Try parsing as JSON
        } catch (error) {
          throw new Error('Failed to parse JSON response');
        }

        // Check if response is successful
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch recipes");
        }

        // Return the recipes if everything is fine
        return data.recipes;
      } catch (error) {
        console.error('Error fetching recipes:', error);  // Log the error for debugging
        throw new Error(error.message || 'Unknown error occurred');
      }
    },
  });
};
