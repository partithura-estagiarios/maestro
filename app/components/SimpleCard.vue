<template>
    <div class="card-container">
        <div class="mini-card" :class="{ flipped: show }">
            {{ computedCardValue }}
        </div>
    </div>
</template>
<script setup>
const props = defineProps({
    cardValue: {
        type: [String, Number],
        default: ''
    },
    show: {
        type: Boolean,
        default: false
    }
})
const computedCardValue = computed(() => {
    return props.show ? props.cardValue : ''
})
</script>
<style lang="scss" scoped>
.mini-card {
    width: 40px;
    height: 60px;
    color: black;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    border-radius: 4px;
    background-color: #8bcbff;
    transition: 0.62s;
}

.flipped {
    animation: myAnim 0.32s ease 0s 1 normal forwards;
    background-color: #ffffff;
}

@keyframes myAnim {

    0% {
        transform: translateY(0) rotateY(0);
        transform-origin: 50% 50%;
        color: #ffffff;
        background-color: #8bcbff;
    }

    100% {
        transform: translateY(0) rotateY(0);
        transform-origin: 50% 50%;
        color: black;
        background-color: #ffffff;
    }

    45% {
        transform: translateY(-15px) rotateY(89deg);
    }

    50% {
        transform: translateY(-15px) rotateY(90deg);
    }

    55% {
        transform: translateY(-15px) rotateY(89deg);
    }


}
</style>