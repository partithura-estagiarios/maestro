<template>
  <div class="callback-container">
    <p>Autenticando...</p>
  </div>
</template>

<script setup>
// import { appStore } from '#imports';
const route = useRoute()
const router = useRouter()

// const store = appStore()


onMounted(async () => {
  const code = route.query.code
  if (code) {
    try {
      // Chama a API do servidor para trocar o código por token do GitHub
      const response = await $fetch('/api/auth/github', {
        method: 'POST',
        body: { code }
      })

      // Salva o token do GitHub no cookie
      const githubToken = useCookie('token', { maxAge: 60 * 60 * 24 * 7 }) // 1 semana
      githubToken.value = response.token
      // Redireciona para dashboard
      try {
        router.push('/dashboard')
      } catch (err) {
        console.error("Houve um erro: ",err)
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      alert('Erro ao fazer login: ' + error.message)
      router.push('/login')
    }
  } else {
    router.push('/login')
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>