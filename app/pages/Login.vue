<template>
    <v-card :loading="loading" width="300px" title="Faça login via Fine-Grained Token" elevation="12">
        <v-card-text>
            <v-text-field v-model="token" :loading="loading" label="GitHub Fine-Grained Token" type="password" required
                clearable hint="Cole seu token de acesso do GitHub" persistent-hint :error="error" />
        </v-card-text>
        <v-card-actions>
            <v-btn :disabled="loading || invalid" block @click="login" text="Login com GitHub" />
        </v-card-actions>
    </v-card>
</template>

<script setup>
// Define o layout "auth"
import { appStore } from '#imports'
definePageMeta({
    layout: 'auth'
})
const token = ref('')
const error = ref(false)
const router = useRouter()
const authStore = appStore()
const loading = ref(false)

const invalid = computed(() => {
    return !token.value
})

const login = () => {
    loading.value = true
    error.value = false
    // Salva o token no cookie
    const githubToken = useCookie('token', { maxAge: 60 * 60 * 24 * 7 })
    githubToken.value = token.value
    authStore.updateCurrentToken(token.value)
    console.log("TOKEN DEVE ESTAR VALIDADO AQUI:", authStore.getCurrentToken)
    authStore.updateUser(token.value)
        .then(valid => {
            console.log("VALID:",valid)
            if (!valid.id) {
                error.value = true
            } else {
                // Redireciona para dashboard
                console.log("REDIRECIONADO")
                router.push('/dashboard')
            }
        })
        .catch(e => {
            console.log("Falha", e)
        })
        .finally(() => {
            loading.value = false
        })
}
</script>
