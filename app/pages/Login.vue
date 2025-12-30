<template>
    <v-col cols="12" sm="8" md="6" lg="5" xl="4" xxl="2">
        <v-sheet class="pa-4">
            <h3 class="mb-4">Maestro</h3>
            <v-form v-model="isValid" @submit.prevent="testLogin()" class="text-center">
                <v-text-field class="text-center" :loading="loading" label="Token de acesso" type="password"
                    v-model="token" prepend-inner-icon="mdi-content-paste" @click:prepend-inner="pasteContent()"
                    :rules="validationRules" />
                <div class="mb-3">
                    <a href="https://github.com/settings/tokens/new" target="_blank">Não tem um token?</a>
                </div>
                <v-btn text="acessar" block size="x-large" type="submit" :disabled="!isValid" :loading="loading"
                    variant="tonal" />
            </v-form>
        </v-sheet>
    </v-col>
</template>
<script setup>
definePageMeta({
    layout: 'auth',
    name: 'Login'
})
const userStore = useUserStore()
const token = ref()
const isValid = ref(false)
const loading = computed(() => {
    return userStore.getLoading
})
const validationRules = computed(() => {
    return [
        val => val != null ? true : 'Token é obrigatório'
    ]
})
function testLogin() {
    userStore.login(token.value)
        .then(r => {
            const cookie = useCookie('token', {})
            cookie.value = token.value
            navigateTo('/')
        })
        .catch(err => {
        })
}
async function pasteContent() {
    token.value = await navigator.clipboard.readText()
}
</script>