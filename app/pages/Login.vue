<template>
    <v-card width="300px" title="Faça login via Fine-Grained Token" elevation="12">
        <v-card-text>
            <v-text-field
              v-model="token"
              label="GitHub Fine-Grained Token"
              type="password"
              required
              clearable
              hint="Cole seu token de acesso do GitHub"
              persistent-hint
            />
        </v-card-text>
        <v-card-actions>
            <v-btn block @click="login" text="Login com GitHub" />
        </v-card-actions>
    </v-card>
</template>

<script setup>
// Define o layout "auth"
definePageMeta({
    layout: 'auth'
})
const token = ref('')
const router = useRouter()

const login = () => {
  if (!token.value) {
    alert('Por favor, insira o token.')
    return
  }

  // Salva o token no cookie
  const githubToken = useCookie('token', { maxAge: 60 * 60 * 24 * 7 })
  githubToken.value = token.value

  // Redireciona para dashboard
  router.push('/dashboard')
}
</script>
