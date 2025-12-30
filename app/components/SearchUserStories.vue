<template>
    <v-sheet class="pa-4">
        <v-form @submit.prevent="updateQuery">
            <v-text-field v-model="query" :disabled="loading" :loading="loading" prepend-icon="mdi-chevron-left"
                hide-details label="Query" placeholder="Digite a query de busca do GitHub."
                @click:prepend="setSelection" append-icon="mdi-magnify" @click:append="updateQuery" />
        </v-form>
        <div class="pt-4">
            <v-row>
                <v-col v-for="issue in issues" :key="issue.id" cols="12" md="12" lg="6" xl="4" xxl="3">
                    <IssueCard :issue="issue" :selected="isSelected(issue)" @click="switchSelection" />
                </v-col>
            </v-row>
        </div>
    </v-sheet>
</template>
<script setup>
const emits = defineEmits(["back"])
const selectedIssues = ref([])
const issues = ref([
    {
        id: 1234,
        dificulty: 5,
        number: 1515,
        type: "Task",
        repository: 'frontend-vuetify',
        title: "***Lorem*** Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        body: "**Lorem** _ipsum_ dolor sit amet consectetur adipisicing elit. Laborum perferendis amet ducimus soluta consectetur. Sint debitis aspernatur officia laborum, repellendus minus voluptates assumenda soluta. Consectetur dolorem distinctio nesciunt molestias a?"
    },
    {
        id: 1456,
        dificulty: null,
        number: 2215,
        type: "Task",
        repository: 'frontend-vuetify',
        title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum perferendis amet ducimus soluta consectetur. Sint debitis aspernatur officia laborum, repellendus minus voluptates assumenda soluta. Consectetur dolorem distinctio nesciunt molestias a?"
    },
    {
        id: 3589,
        dificulty: null,
        number: 712,
        type: "Task",
        repository: 'frontend-vuetify',
        title: "Lorem ipsum dolor sit amet...",
        body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum perferendis amet ducimus soluta consectetur. Sint debitis aspernatur officia laborum, repellendus minus voluptates assumenda soluta. Consectetur dolorem distinctio nesciunt molestias a?"
    },
])
const query = ref('')
const loading = ref(false)

function isSelected(issue) {
    return selectedIssues.value.findIndex(i => { return i.id == issue.id }) >= 0
}

function updateQuery() {
    //atualizar a query e chamar api do github
    console.log("Query", query.value)
    loading.value = true
    setTimeout(() => {
        loading.value = false
    }, 3000)
}
function setSelection() {
    emits("back", selectedIssues.value)
}
function switchSelection(issue) {
    //buscar issue e trocar o status de seleção
    const issueIndex = selectedIssues.value.findIndex(i => { return i.id == issue.id })
    if (issueIndex < 0) {
        selectedIssues.value.push(issue)
    } else {
        selectedIssues.value.splice(issueIndex, 1)
    }
}
</script>