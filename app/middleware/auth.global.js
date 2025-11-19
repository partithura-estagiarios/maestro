export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie('token').value

  const publicPages = ['/login']

  if (!token && !publicPages.includes(to.path)) {
    return navigateTo('/login')
  }

  if (token && publicPages.includes(to.path)) {
    return navigateTo('/dashboard')
  }
})