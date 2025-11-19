<template>
    <!-- Aqui é a configuração a nível de usuário -->
    <v-app-bar elevation="0">
        <!-- <v-app-bar-nav-icon /> -->
        <v-app-bar-title>
            Maestro
        </v-app-bar-title>
        <template v-slot:append>
            <v-tooltip text="Tema" location="bottom">
                <template v-slot:activator="{ props }">
                    <v-btn @click="toggleTheme" v-bind="props" icon="mdi-theme-light-dark" />
                </template>
            </v-tooltip>
            <v-menu>
                <template v-slot:activator="{ props }">
                    <v-avatar v-bind="props" :image="userImageUrl" start />
                </template>
                <v-list>
                    <v-list-item v-for="(item, index) in userMenu" :key="item.id" :value="index">
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item>

                    <v-list-item @click="logout">
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </template>
    </v-app-bar>
</template>
<script setup>
import { ref } from '#imports'
import { useTheme } from 'vuetify'
import { appStore } from '#imports'

const authStore = appStore()

const userImageUrl = computed(()=>authStore.getCurrentUserInfo.avatar_url)

const userMenu = ref([])

const theme = useTheme()
function toggleTheme() {
    theme.toggle()
}

const logout = () => {
    // Remove o token
    const token = useCookie('token')
    token.value = null

    // Redireciona para login
    navigateTo('/login')
}

</script>