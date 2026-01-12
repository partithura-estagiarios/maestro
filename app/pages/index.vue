<template>
    <v-row>
        <DefaultHeader
            to=""
            hide-button />
        <v-col cols="12">
            <v-row
                justify="center"
                align="center">
                <v-col
                    v-if="isManagement"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        to="/configuration"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">Configurações</div>
                    </v-btn>
                </v-col>
            </v-row>
            <hr class="mt-4" />
            <h3>Organizações:</h3>
            <v-row
                justify="center"
                align="center">
                <v-col
                    v-for="organization in organizations"
                    :key="organization.id"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`/${organization.id}`"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">{{ organization.name }}</div>
                    </v-btn>
                </v-col>
                <NewItemButton tooltip="Adicionar nova organização" />
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "Dashboard",
});
const navigationStore = useNavigationStore();
const userStore = useUserStore();
const organizationStore = useOrganizationStore();

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});

const organizations = computed(() => {
    return organizationStore.getOrganizations;
});
onMounted(() => {
    navigationStore.setBreadcrumbs([]);
});
</script>
