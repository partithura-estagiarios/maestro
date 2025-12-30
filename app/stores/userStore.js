import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {},
    loading: false,
  }),
  getters: {
    getUser: (state) => {
      return state.user;
    },
    getLoading: (state) => {
      return state.loading;
    },
  },
  actions: {
    setUser(v) {
      this.user = v;
    },
    async fetchUserInfo() {
      this.loading = true;
      //   const appStore = useAppStore();
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        // appStore.updateCurrentToken(null);
        this.loading = false;
        throw new Error("Nenhum token disponível.");
      }

      try {
        const users = await $fetch("/api/user/read", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
          },
        });
        this.users = users;
        return users;
      } catch (error) {
        console.error("Erro ao criar carta:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async login(token) {
      this.loading = true;
      if (!token) {
        this.loading = false;
        throw new Error("Nenhum token disponível.");
      }

      try {
        const userResponse = await $fetch("/api/user/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.user = userResponse;
        return userResponse;
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.user = {};
    },
  },
});
