<template>
    <v-dialog persistent max-width="1440px" v-model="showDialog">
        <v-card>
            <v-toolbar density="compact">
                <template #title>
                    <div class="markdown-body" v-html="computedTitle" />
                </template>
                <template #append>
                    <div>
                        <v-chip class="mx-2">Task</v-chip>
                        <a target="_blank" :href="issueLink"><span :style="`color: ${repositoryColor}`">{{
                            issue.repository
                                }}/<span class="text-grey">#{{ issue.number
                                }}</span></span></a>
                    </div>
                    <v-icon @click="closeModal" icon="mdi-close" class="ml-4 mr-2" />
                </template>
            </v-toolbar>
            <v-card-text>
                <v-sheet class="px-2">
                    <div class="markdown-body" v-html="computedBody" />
                </v-sheet>
            </v-card-text>
            <v-card-actions>
                <h4>Dificuldade definida: <span class="text-grey">{{ issue.dificulty }}</span></h4>
                <v-spacer />
                <v-btn variant="outlined" @click="closeModal">Fechar</v-btn>
                <v-btn variant="outlined" @click="selectIssue" color="success">{{ props.issue.selected ? 'Remover' :
                    'Adicionar'
                }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script setup>
const emits = defineEmits(["close", "select"])
const props = defineProps({
    issue: {
        type: Object,
        required: true
    }
})
const computedBody = computed(() => {
    return parseGitMD(props.issue.body)
})
const computedTitle = computed(() => {
    return parseGitMD(props.issue.title)
})
const organization = computed(() => {
    return 'partithura'
})
const repository = computed(() => {
    return props.issue.repository
})
const issueNumber = computed(() => {
    return props.issue.number
})
const repositoryColor = computed(() => {
    return '#70FF90'
})
const issueLink = computed(() => {
    return `https://github.com/${organization.value}/${repository.value}/issues/${issueNumber.value}`
})
const showDialog = defineModel({ type: Boolean })
function closeModal() {
    showDialog.value = false
    emits("close")
}
function selectIssue() {
    emits("select", props.issue)
    closeModal()
}
</script>
<style lang="scss" scoped>
a {
    text-decoration: none;

    span {
        color: white;
    }

    :hover {
        text-decoration: underline;
    }
}
</style>