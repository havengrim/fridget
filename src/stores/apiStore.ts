import { defineStore } from "pinia";

interface ApiState {
  user: string | null;
  token: string | null;
  apiUrl: string;
  ingredients: Record<string, string[]>; // Stores user ingredients by category
}

export const useApiStore = defineStore("api", {
  state: (): ApiState => ({
    user: null,
    token: localStorage.getItem("token") || null,
    apiUrl: "http://127.0.0.1:8000/api/auth",
    ingredients: {} as Record<string, string[]>,
  }),
  
  actions: {
    async login(email: string, password: string) {
      try {
        const response = await fetch(`${this.apiUrl}/login/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: email, password }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Login failed");

        this.token = data.token;
        this.user = email;
        localStorage.setItem("token", data.token);

        return { success: true };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
    },

    async registerUser(userData: any) {
      try {
        const response = await fetch(`${this.apiUrl}/register/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Registration failed");

        return { success: true, message: "Registration successful!" };
      } catch (error) {
        return { success: false, message: (error as Error).message };
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },

    // 🆕 Fetch User Ingredients
    async fetchIngredients() {
      if (!this.token) {
        console.error("Fetch Ingredients Error: No token found.");
        return;
      }
    
      try {
        console.log("Fetching Ingredients with token:", this.token);
    
        const response = await fetch(`${this.apiUrl}/ingredients/`, {
          headers: {
            "Authorization": `Token ${this.token}`, // FIXED!
            "Content-Type": "application/json",
          },
        });
    
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token.");
        }
    
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch ingredients.");
    
        this.ingredients = data.reduce((acc: Record<string, string[]>, item: any) => {
          acc[item.category] = acc[item.category] || [];
          acc[item.category].push(item.name);
          return acc;
        }, {});
      } catch (error) {
        console.error("Fetch Ingredients Error:", (error as Error).message);
      }
    },

    async addIngredient(ingredient: string, category: string) {
      if (!this.token) {
        console.error("Add Ingredient Error: No token found.");
        return { success: false, message: "Authentication required." };
      }
    
      const requestBody = {
        name: ingredient, // 🛠️ Ensure this is a string
        category: category, 
      };
    
      console.log("Request Body:", JSON.stringify(requestBody));
      console.log("Token:", this.token);
    
      try {
        const response = await fetch(`${this.apiUrl}/ingredients/`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: Array.isArray(ingredient) ? ingredient : [ingredient], category }), // ✅ Ensure an array
        });
        const responseData = await response.json();
    
        if (!response.ok) {
          console.error("API Error Response:", responseData);
          throw new Error(JSON.stringify(responseData));
        }
    
        console.log("Success:", responseData);
        return { success: true };
      } catch (error) {
        console.error("Add Ingredient Error:", error);
        return { success: false, message: error.message };
      }
    },      

    async deleteIngredient(category: string, index: number) {
      if (!this.token) {
        console.error("Delete Ingredient Error: No token found.");
        return;
      }
    
      try {
        console.log("Deleting Ingredient with token:", this.token);
    
        const response = await fetch(`${this.apiUrl}/ingredients/delete/`, {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${this.token}`, // FIXED!
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category, index }),
        });
    
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token.");
        }
    
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to delete ingredient.");
    
        this.ingredients[category].splice(index, 1);
      } catch (error) {
        console.error("Delete Ingredient Error:", (error as Error).message);
      }
    },    
  },
});
