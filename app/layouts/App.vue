<template>
    <div>
        <ApplicationUserToolbar />
        <v-breadcrumbs :items="items">
            <template #prepend>
                <v-icon
                    icon="mdi-home"
                    size="small" />
            </template>
        </v-breadcrumbs>
        <v-container :fluid="$vuetify.display.lgAndDown">
            <slot />
        </v-container>
        <v-footer app />
    </div>
</template>

<script setup>
const navigationStore = useNavigationStore();
// const userStore = useUserStore()

const items = computed(() => {
    return navigationStore.getBreadcrumbs;
});
</script>

<style lang="scss" scoped>
.api-usage-status {
    position: fixed;
    top: 12px;
    right: 190px;
    color: white;
    z-index: 3000;
}
</style>
