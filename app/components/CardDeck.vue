<template>
    <v-card :loading="props.loading" color="grey-darken-3" title="Seu Voto:">
        <v-card-text class="mt-6 pb-2 pt-2">
            <v-row align="center" justify="center">
                <v-col cols="6" md="1" v-for="card in cards" :key="card.value">
                    <PokerCard :selected="card.value === model" :card-value="card.value" :color="card.color"
                        :minimum-value="card.minimumValue" :maximum-value="card.maximumValue" @click="selectCard" />
                </v-col>
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
    }
})
const cards = computed(() => {
    return cardStore.getCardDeck
})
const model = defineModel({ type: Number })
function selectCard(v) {
    model.value = v
}
</script>