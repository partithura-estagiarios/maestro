<template>
    <v-dialog persistent max-width="1240px" v-model="model">
        <v-card>
            <v-toolbar>
                <template #title>
                    <div v-html="title" />
                </template>
                <template #append>
                    <v-icon icon="mdi-close" @click="closeModal"></v-icon>
                </template>
            </v-toolbar>
            <v-card-text>
                <div v-html="body"></div>
                <CardDeck :loading="loading" v-model="selectedCard" />
            </v-card-text>
            <v-card-actions>
                <v-btn @click="confirmVote" color="success" variant="tonal">Confirmar voto</v-btn>
                <v-spacer />
                <v-btn :href="issueURL" target="_blank">Ver no GitHub</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
import { appStore, useIssuesStore } from '#imports'
const authStore = appStore()
const issuesStore = useIssuesStore()
const props = defineProps({
    issue: {
        type: Object,
        default: () => { }
    }
})
const emits = defineEmits(["confirmVote"])
const model = defineModel({ type: Boolean })

const selectedCard = ref(null)
const databaseIssue = ref()
const loading = ref(false)
const title = computed(() => {
    return props.issue?.fields?.find(field => {
        return field.name == "Title"
    }).value?.raw
})
const body = computed(() => {
    return props.issue?.content?.body
})
const issueURL = computed(() => {
    return props.issue?.content?.html_url
})
const user = computed(() => {
    return authStore.getCurrentUserInfo
})
function closeModal() {
    selectedCard.value = null
    model.value = false
}

function confirmVote() {
    emits("confirmVote", {
        issue: props.issue,
        vote: selectedCard.value,
        user: user.value
    })
    model.value = false
}

watch(model, async (n, o) => {
    if (n && !o) {
        loading.value=true
        databaseIssue.value = await issuesStore.fetchCurrentIssue(props.issue.id)
        if (databaseIssue.value) {
            const i = databaseIssue.value.votes.findIndex(vote => {
                return vote.user.id == user.value.id
            })
            if (i >= 0) {
                selectedCard.value = databaseIssue.value.votes[i].vote
            }

        }
        loading.value=false
    }
})
</script>