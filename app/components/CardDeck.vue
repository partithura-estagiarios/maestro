<template>
    <v-row
        justify="space-evenly"
        justify-xxl="center"
        justify-xl="center">
        <BigCard
            v-for="card in props.cards"
            :key="card.value"
            :card-value="card.value"
            :card-color="card.color"
            :card-tooltip="card.tooltip"
            :card-selected="cardSelected"
            @card-selected="setSelectedCard"
            @card-unselected="deselectCard" />
    </v-row>
    <v-row
        align-content="center"
        justify="center">
        <v-btn
            size="x-large"
            :disabled="isDisabled"
            @click="chooseCard"
            >Votar</v-btn
        >
    </v-row>
</template>
<script setup>
const emits = defineEmits(["cardSelected", "cardUnselected", "chooseCard"]);

const props = defineProps({
    cards: {
        type: Array,
        default: () => {
            return [];
        },
    },
    cardSelected: {
        type: [String, Number],
        default: null,
    },
});

const isDisabled = computed(() => {
    return props.cardSelected == null;
});

function setSelectedCard(v) {
    emits("cardSelected", v);
}
function deselectCard(v) {
    emits("cardUnselected", v);
}
function chooseCard() {
    emits("chooseCard");
}
</script>
