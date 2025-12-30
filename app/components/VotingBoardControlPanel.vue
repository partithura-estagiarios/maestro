<template>
    <v-card :rounded="0" variant="outlined" class="mx-auto" title="Painel de controle">
        <template v-if="isManagement" #append>
            <v-tooltip location="top start" open-delay="1000" text="Mudar entre visualização de gráfico e de cartas.">
                <template #activator="activator">
                    <v-icon :disabled="!isConnected" class="mr-3" v-bind="activator.props"
                        :icon="isChart ? 'mdi-text-box' : 'mdi-chart-bar'" @click="switchCharts" />
                </template>
            </v-tooltip>
            <v-tooltip location="top start" open-delay="1000" text="Adicionar issues para votação.">
                <template #activator="activator">
                    <v-icon :disabled="!isConnected" v-bind="activator.props" icon="mdi-plus" @click="addUserStories" />
                </template>
            </v-tooltip>
        </template>
        <v-card-text>
            <v-row dense>
                <v-col v-if="isManagement" cols="12" sm="6" md="12" lg="12" xl="6">
                    <v-btn :disabled="!isConnected" text="Resetar Timer" block color="primary" @click="resetTimer" />
                </v-col>
                <v-col v-if="isManagement" cols="12" sm="6" md="12" lg="12" xl="6">
                    <v-btn :disabled="!isConnected" text="Limpar votos" block color="primary" @click="cleanVotes" />
                </v-col>
                <v-col v-if="isManagement" cols="12" sm="6" md="12" lg="12" xl="6">
                    <v-btn :disabled="!isConnected" text="Pular história" block color="primary" @click="skipStory" />
                </v-col>
                <v-col v-if="isManagement" cols="12" sm="6" md="12" lg="12" xl="6">
                    <v-btn :disabled="!isConnected" text="Mostrar Votos" block color="primary" @click="showVotes" />
                </v-col>
                <v-col cols="12">
                    <v-btn :text="sessionButtonText" block :color="isConnected ? 'error' : 'success'"
                        @click="endSession" />
                </v-col>
                <v-col cols="12" v-if="isManagement" sm="4" xl="4" lg="12" md="12">
                    <v-select :disabled="!isConnected" density="compact" v-model="finalValue" :items="possibleValues"
                        label="Valor" />
                </v-col>
                <v-col cols="12" v-if="isManagement" sm="8" xl="8" lg="12" md="12">
                    <v-btn :disabled="!isConnected" text="Definir dificuldade" block color="success"
                        @click="defineFinalValue" />
                </v-col>
            </v-row>
            <v-sheet class="scrollable-content">
                <v-row v-for="(issue, n) in issues" :key="issue.id" dense no-gutters>
                    <VotingBoardIssueItem :is-management="isManagement" @select="selectIssue" :issue="issue"
                        :selected-issue="selectedIssue" :index="n" />
                </v-row>
            </v-sheet>
        </v-card-text>
    </v-card>
</template>
<script setup>
const emits = defineEmits(["reset", "clean", "skip", "show", "end", "finalize", "select", "switchCharts", "add"])
const props = defineProps({
    issues: {
        type: Array,
        default: () => []
    },
    selectedIssue: {
        type: Object,
        default: () => { }
    },
    isChart: {
        type: Boolean,
        default: false
    },
    isConnected: {
        type: Boolean,
        default: false
    },
    isManagement: {
        type: Boolean,
        default: false
    }
})

const finalValue = ref()
const possibleValues = ref(['?', 0, 1, 2, 3, 5, 8, 12, 21])

const sessionButtonText = computed(() => {
    if (props.isManagement) {
        return props.isConnected ? 'Terminar sessão' : 'Iniciar sessão'
    }
    return props.isConnected ? 'Desconectar' : 'Conectar'
})

function switchCharts() {
    emits("switchCharts", props.isChart)
}
function selectIssue(issue) {
    emits("select", issue)
}
function resetTimer() {
    emits("reset")
}
function cleanVotes() {
    emits("clean")
}
function skipStory() {
    emits("skip")
}
function showVotes() {
    emits("show")
}
function endSession() {
    emits("end")
}
function defineFinalValue() {
    emits("finalize", finalValue.value)
}
function addUserStories() {
    emits("add")
}
</script>
<style lang="scss" scoped>
.scrollable-content {
    overflow-y: scroll;
    max-height: 200px;
}
</style>