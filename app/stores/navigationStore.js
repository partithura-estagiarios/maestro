import { defineStore } from "pinia";

export const useNavigationStore = defineStore("navigationStore", {
  state: () => ({
    breadcrumbs: [],
    homeBread: {
      title: "Dashboard",
      disabled: false,
      to: "/",
    },
  }),
  getters: {
    getBreadcrumbs: (state) => {
      return [state.homeBread, ...state.breadcrumbs];
    },
  },
  actions: {
    setBreadcrumbs(v) {
      this.breadcrumbs = v;
    },
  },
});
