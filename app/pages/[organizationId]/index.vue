<template>
    <v-row>
        <DefaultHeader
            to="/"
            :title="organizationName" />
        <v-col cols="12">
            <h2>Projetos:</h2>
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
            <h3>Projetos:</h3>
            <v-row
                dense
                align="center"
                justify="center">
                <v-col
                    v-for="project in projects"
                    :key="project.number"
                    cols="12"
                    md="6"
                    lg="4"
                    xl="3"
                    xxl="2">
                    <v-btn
                        :to="`${baseRoute}/${project.number}`"
                        :color="project.color"
                        height="120px"
                        block
                        size="x-large">
                        <div class="px-4 py-2">{{ project.name }}</div>
                    </v-btn>
                </v-col>
                <NewItemButton
                    tooltip="Adicionar Novo Projeto"
                    @click="showNewProjectDialog" />
            </v-row>
        </v-col>
        <AddProjectDialog v-model="newProjectModel" />
    </v-row>
</template>
<script setup>
definePageMeta({
    layout: "app",
    name: "",
});
const navigationStore = useNavigationStore();
const projectStore = useProjectStore();
const userStore = useUserStore();
const route = useRoute();
const organizationId = computed(() => {
    return route.params.organizationId;
});

const isManagement = computed(() => {
    return userStore.getUser?.isManagement;
});
const organizationName = computed(() => {
    return "Partithura";
});
const baseRoute = computed(() => {
    return `${organizationId.value}`;
});
const projects = computed(() => {
    return projectStore.getProjects;
});
const newProjectModel = ref(false);

function showNewProjectDialog() {
    newProjectModel.value = true;
}

onMounted(() => {
    navigationStore.setBreadcrumbs([
        {
            title: `${organizationName.value}`,
            disabled: true,
            to: `${organizationId.value}`,
        },
    ]);
});
onBeforeMount(() => {
    projectStore.fetchProjects();
    projectStore.setActiveProject(route.params.projectId);
});
</script>
