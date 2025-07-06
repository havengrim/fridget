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

export const useGetRecipes = () => {
  return useQuery({
    queryKey: ['recipes'],
   queryFn: async () => {
  const res = await fetch(`${API_URL}/recipes/ai/`, {
    headers: {
      Authorization: `Token ${getToken()}`,
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  console.log('API response:', data)
  if (!res.ok) throw new Error(data.error || 'Failed to fetch recipes')
  return data.recipes.dishes || []
},
    enabled: !!getToken(), 
  })
}
