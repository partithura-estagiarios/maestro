<template>
    <v-card :loading="props.loading" :color="cantVote ? 'error' : 'grey-darken-3'" title="Votação:">
        <v-card-text class="mt-6 pb-2 pt-2">
            <v-row v-if="isManagement" align="center" justify="center">
                <v-col cols="12" md="2" v-for="vote in votes" :key="vote.user.id">
                    <v-card elevation="12">
                        <v-toolbar>
                            <template #prepend>
                                <v-avatar :image="vote.user.avatar_url"></v-avatar>
                            </template>
                            <template #title>
                                <v-tooltip location="top left">
                                    <template #activator="{ props }">
                                        <span v-bind="props">{{ vote.user.name }}</span>
                                    </template>
                                    {{ vote.user.name }}
                                </v-tooltip>
                            </template>
                        </v-toolbar>
                        <v-card-text>
                            <h3 class="text-center">Votou:</h3>
                            <h1 class="text-center">{{ vote.vote }}</h1>
                        </v-card-text>
                    </v-card>
                </v-col>
                <v-col cols="12">
                    <v-card elevation="12">
                        <v-toolbar>
                            <template #title>
                                Resultado:
                            </template>
                        </v-toolbar>
                        <v-card-text>
                            <h3 class="text-center">Decisão do time:</h3>
                            <h3 class="text-center">{{ result.value }}</h3>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else align="center" justify="center">
                <h4 v-if="cantVote">Não há cartas suficientes definidas nas configurações</h4>
                <template v-else>
                    <v-col cols="6" md="1" v-for="card in cards" :key="card.value">
                        <PokerCard :loading="props.loading" :selected="card.value === model" :card-value="card.value"
                            :color="card.color" :minimum-value="card.minimumValue" :maximum-value="card.maximumValue"
                            @click="selectCard" />
                    </v-col>
                </template>
            </v-row>
        </v-card-text>
    </v-card>
</template>
<script setup>
import { appStore } from '#imports'
const cardStore = appStore()
const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    },
    cantVote: {
        type: Boolean,
        default: false
    },
    votes: {
        type: Array,
        default: () => []
    }
})
const cards = computed(() => {
    return cardStore.getCardDeck
})
const isManagement = computed(() => {
    return cardStore.getCurrentUserInfo.isManagement
})
const model = defineModel({ type: Number })
function selectCard(v) {
    model.value = v
}
const result = computed(() => {
    let values = []
    if (props.votes.length) {
        props.votes.forEach(vote => {
            if (!values.includes(vote.vote)) {
                values.push(vote.vote)
            }
        });
    }
    values.sort((a, b) => {
        return a - b
    })
    const substring = values.length > 1 ? `Os votos selecionados são ${values}.` : 'Nenhum voto foi contabilizado'
    return values.length == 1 ? { isFinal: true, value: values[0] } : { isFinal: false, value: `O time não chegou em um acordo. ${substring}` }
})

defineExpose({result})
</script>