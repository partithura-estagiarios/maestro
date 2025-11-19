<template>
    <v-container>
        <v-card :loading="loading" color="black">
            <v-card-title class="px-0 pt-0">
                <v-toolbar>
                    <template #title>
                        Histórias aguardando seu voto
                    </template>
                </v-toolbar>
            </v-card-title>
            <v-card-text class="scrollable-content">
                <v-row v-if="!loading">
                    <IssueCard v-for="issue in issues" :key="issue.id" :issue="issue" @click="viewIssue" />
                </v-row>
                <v-skeleton-loader v-else width="100%" height="100vh" />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <div class="controls">
                    <div class="navigation-buttons">
                        <v-btn variant="outlined" v-show="prevArrow" :disabled="disabled" icon="mdi-arrow-left" @click="loadPrevPage"/>
                    </div>
                    <div class="navigation-buttons">
                        <v-btn variant="outlined" v-show="nextArrow" :disabled="disabled" icon="mdi-arrow-right" @click="loadNextPage"/>
                    </div>
                </div>
                <v-spacer />
            </v-card-actions>
        </v-card>
        <IssueModal v-model="showIssueModal" :issue="selectedIssue" @confirmVote="confirmVote" />
    </v-container>
</template>

<script setup>
import { appStore, useIssuesStore } from '#imports'
const authStore = appStore();
const issuesStore = useIssuesStore()
const loading = ref(false)
definePageMeta({
    layout: 'app',
})

const user = ref(null)
const issues = computed(() => {
    return issuesStore.getCurrentIssues
})

function loadNextPage(){
    console.log("Next: ",nextArrow.value)
    loadIssues({
        direction:'next',
        id:nextArrow.value
    })
}
function loadPrevPage(){
    loadIssues({
        direction:'prev',
        id:prevArrow.value
    })
}

onMounted(async () => {
    try {
        user.value = await authStore.updateUser()
        await authStore.fetchCardDeck()
        await loadIssues()
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error)
        // Opcional: redirecionar para login
    }
})
async function confirmVote(issue) {
    const r = await issuesStore.setIssueVote(issue)
    selectedIssue.value = null
    console.log("Response:", r)
}
const showIssueModal = ref(false)
const selectedIssue = ref()

const nextArrow = computed(() => {
    return issuesStore.getParsedLinks?.next?.url?.params?.after
})
const prevArrow = computed(() => {
    return issuesStore.getParsedLinks?.prev?.url?.params?.before
})

function viewIssue(issue) {
    selectedIssue.value = issue
    //chamar api
    showIssueModal.value = true
}

async function loadIssues(direction="") {
    loading.value=true
    try {
        const filters = {
            org: "partithura",
            projectNumber: 17,
            paginationSize: 12,
        }
        await issuesStore.fetchIssues(filters,direction)
    } catch (error) {
        alert('Erro ao buscar issues: ' + error.message)
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.scrollable-content {
    overflow-y: scroll;
    max-height: calc(100vh - 270px);
}
.navigation-buttons{
    width: 86px;
}
.controls{
    display: flex;
    align-items: center;
    justify-content: center;
    justify-items: center;
}
</style>