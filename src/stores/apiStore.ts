import { defineStore } from "pinia";

interface ApiState {
    user: string | null;
    token: string | null;
    apiUrl: string;
  }

export const useApiStore = defineStore("api", {
  state: (): ApiState => ({
    user: null,
    token: localStorage.getItem("token") || null,
    apiUrl: "http://127.0.0.1:8000/api/auth",
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
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
    },
  },
});
