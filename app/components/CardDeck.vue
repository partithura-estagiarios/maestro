<template>
    <v-row
        justify="space-evenly"
        justify-xxl="center"
        justify-xl="center">
        <v-skeleton-loader
            v-if="loading"
            type="article" />
        <template v-else>
            <template v-if="cards?.length">
                <BigCard
                    v-for="card in cards"
                    :key="card.value"
                    :disabled="props.disabled"
                    :card-value="card.value"
                    :card-color="card.color"
                    :card-tooltip="card.tooltip"
                    :card-selected="cardSelected"
                    @card-selected="setSelectedCard"
                    @card-unselected="deselectCard" />
            </template>
            <template v-else>
                <div class="pa-8 text-center">
                    {{ message }}
                </div>
            </template>
        </template>
    </v-row>
    <v-row
        align-content="center"
        justify="center">
        <v-btn
            class="mx-2"
            size="x-large"
            :disabled="isDisabled"
            @click="chooseCard"
            >Votar</v-btn
        >
        <CardCalculator
            :disabled="props.disabled"
            @value-calculated="setSelectedCard" />
    </v-row>
</template>
<script setup>
const cardStore = useCardStore();
const emits = defineEmits(["cardSelected", "cardUnselected", "chooseCard"]);

const props = defineProps({
    cardSelected: {
        type: [String, Number],
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const cards = computed(() => {
    return loading.value ? [] : cardStore.getCards;
});

const loading = computed(() => {
    return cardStore.getLoading;
});

const message = computed(() => {
    return "Não há cartas salvas no banco";
});

const isDisabled = computed(() => {
    return props.cardSelected == null || props.disabled;
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
onMounted(() => {
    cardStore.fetchCards().catch((err) => {
        console.log("ERROR:", err);
        //tratar erro
    });
});
</script>
