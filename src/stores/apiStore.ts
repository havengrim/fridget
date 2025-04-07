import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const API_URL = 'http://127.0.0.1:8000/api/auth'
const getToken = () => localStorage.getItem('token')

// 🧪 Login
export const useLogin = () => {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string, password: string }) => {
      const res = await fetch(`${API_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      localStorage.setItem('token', data.token)
      return data
    },
  })
}

// 🧪 Register
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: any) => {
      const res = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')

      return data
    },
  })
}

// 🧪 Fetch Ingredients
export const useIngredients = () => {
  return useQuery({
    queryKey: ['ingredients'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/ingredients/`, {
        headers: {
          Authorization: `Token ${getToken()}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch ingredients')

      return data.reduce((acc: Record<string, string[]>, item: any) => {
        acc[item.category] = acc[item.category] || []
        acc[item.category].push(item.name)
        return acc
      }, {})
    },
    enabled: !!getToken(),
  })
}

// 🧪 Add Ingredient
export const useAddIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, category }: { name: string[], category: string }) => {  // Change name type to string[] (array of strings)
      const res = await fetch(`${API_URL}/ingredients/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, category }),  // Send name as an array
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to add ingredient')

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ category, index }: { category: string; index: number }) => {
      const res = await fetch(`${API_URL}/ingredients/delete_by_index/`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${getToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, index }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete ingredient')

      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      // Simply clear the token from localStorage for now
      localStorage.removeItem('token')
    },
  })
}

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
