import { appStore } from "#imports";
let authStore;

export default defineNuxtRouteMiddleware((to, from) => {
  //Criar authStore caso ainda não tenha sido instanciada
  if (!authStore) {
    authStore = appStore();
  }

  //pega o token dos cookies e valida
  const token = useCookie("token").value;
  console.log("PORRA DO TOKEN: ", token);

  //página de login com acesso público
  const publicPages = ["/login"];

  authStore
    .checkToken(token)
    .then((isValidToken) => {
      //caso não consiga validar o token acessando uma página privada, limpa o token e navega para login
      console.log("IsValidToken",isValidToken)
      if (!isValidToken && !publicPages.includes(to.path)) {
        console.log("DEVERIA ENTRAR AQUI");
        authStore.logout();
        return navigateTo("/login");
      }

      // if (!token && !publicPages.includes(to.path)) {
      //   console.log("Deslogando usuário")
      //   authStore.logout()
      //   return navigateTo("/login");
      // }

      // if (isValidToken && !authStore.getCurrentUserInfo.login) {
      //   authStore.logout();
      //   return navigateTo("/login");
      // }

      if (isValidToken && publicPages.includes(to.path)) {
        return navigateTo("/dashboard");
      }
    })
    .catch((e) => {
      authStore.logout();
      return navigateTo("/login");
    })
});
