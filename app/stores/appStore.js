import { defineStore } from "pinia";

export const appStore = defineStore("appStore", {
  state: () => ({
    userInfo: {},
    token: "",
    cards: [],
  }),
  getters: {
    getCurrentUserInfo: (state) => state.userInfo,
    getCurrentToken: (state) => state.token,
    getCardDeck: (state) => state.cards,
  },
  actions: {
    updateCurrentUserInfo(v) {
      this.userInfo = v;
    },
    updateCurrentToken(v) {
      this.token = v;
    },
    async updateUser() {
      const githubToken = useCookie("token");
      if (!githubToken.value) {
        this.updateCurrentToken(null);
        throw new Error("Nenhum token disponível.");
      }

      try {
        const user = await $fetch("/api/user/github", {
          headers: {
            Authorization: `Bearer ${githubToken.value}`,
          },
        });
        this.updateCurrentUserInfo(user);
        this.updateCurrentToken(githubToken.value);
        return user;
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
      }
    },
    async fetchCardDeck() {
      //criar endpoint pra retornar card deck
      this.cards = [
        {
          value: 0,
          minimumValue: 0,
          maximumValue: 0.5,
          color:'#00a4aa'
        },
        {
          value: 1,
          minimumValue: 0.5,
          maximumValue: 1,
          color:'#5baa00'
        },
        {
          value: 2,
          minimumValue: 1,
          maximumValue: 2,
          color:'#7daa00'
        },
        {
          value: 3,
          minimumValue: 2,
          maximumValue: 4,
          color:'#99aa00'
        },
        {
          value: 5,
          minimumValue: 4,
          maximumValue: 8,
          color:'#aa9f00'
        },
        {
          value: 8,
          minimumValue: 8,
          maximumValue: 16,
          color:'#aa7400'
        },
        {
          value: 13,
          minimumValue: 16,
          maximumValue: 32,
          color:'#aa3e00'
        },
        {
          value: 21,
          minimumValue: 32,
          maximumValue: 64,
          color:'#AA0000'
        },
      ];
    },
  },
});
