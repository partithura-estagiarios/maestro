<template>
    <v-row
        no-gutters
        dense>
        <v-col cols="12">
            <div class="d-flex align-center">
                <v-icon
                    class="mr-4"
                    icon="mdi-arrow-left"
                    @click="goBack()" />
                <h2>Sala de votação</h2>
                <v-spacer />
            </div>
        </v-col>
        <v-col cols="12">
            <v-row
                no-gutters
                dense>
                <VotingBoardStatusBar
                    ref="statusBar"
                    :is-connected="isConnected"
                    :start-time="startTimerTime"
                    @connect="connectToServer()" />
                <v-col
                    cols="12"
                    xl="3"
                    xxl="2"
                    lg="3"
                    md="4"
                    sm="12">
                    <v-sheet
                        height="100%"
                        class="pa-4">
                        <VotingBoardControlPanel
                            :is-management="isManagement"
                            :issues="issues"
                            :selected-issue="activeIssue"
                            :is-chart="isChart"
                            :is-connected="isConnected"
                            @show="requestShowCards"
                            @reset="startTimer"
                            @select="setSelectedIssue"
                            @switch-charts="switchCharts"
                            @skip="requestNextIssue"
                            @clean="clearVotes"
                            @add="addUserStories"
                            @end="checkSessionStatus"
                            @finalize="setIssueDifficulty" />
                        <v-sheet
                            class="pa-1 scrollable-content"
                            variant="outlined">
                            <template v-if="users.length">
                                <UserCard
                                    v-for="user in users"
                                    :key="user.id"
                                    :user="user"
                                    :show-cards="showCards"
                                    :timer="startTimerTime" />
                            </template>
                            <v-card
                                v-else
                                height="80px"
                                :rounded="0"
                                variant="elevated"
                                hover
                                class="mx-auto">
                                <v-card-text class="text-center">
                                    Aguardando usuários...
                                </v-card-text>
                            </v-card>
                        </v-sheet>
                    </v-sheet>
                </v-col>
                <v-col
                    cols="12"
                    xl="9"
                    xxl="10"
                    lg="9"
                    md="8"
                    sm="12">
                    <SearchUserStories
                        v-if="showSelectionScreen"
                        @back="addIssues" />
                    <template v-else>
                        <v-sheet>
                            <div class="markdown-body" />
                        </v-sheet>
                        <v-sheet class="pa-4">
                            <CardDeck
                                :card-selected="voteValue"
                                :cards="computedCards"
                                @card-selected="setSelectedCard"
                                @card-unselected="deselectCard"
                                @choose-card="chooseCard" />
                            <v-row
                                v-if="isChart"
                                align="center"
                                justify="center">
                                <v-col
                                    cols="12"
                                    xl="6"
                                    xxl="4"
                                    lg="8"
                                    md="10"
                                    sm="12">
                                    <div class="chart-container">
                                        <Bar
                                            style="max-height: 300px"
                                            :data="chartData"
                                            :options="chartOptions" />
                                    </div>
                                </v-col>
                            </v-row>
                        </v-sheet>
                    </template>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>
<script setup>
import { io } from "socket.io-client";
import { Bar } from "vue-chartjs";

definePageMeta({
    layout: "app",
    name: "Votação",
});
const userStore = useUserStore();
const startTimerTime = ref(0);
let socket;
const users = ref([]);
const voteValue = ref(null);
const showCards = ref(false);
const isChart = ref(false);
const endTimerTime = ref(0);
const statusBar = ref();
const showSelectionScreen = ref(false);
const roomName = ref("");

const chartData = ref({
    labels: ["1 Ponto", "2 Pontos", "3 Pontos", "Indeciso"],
    datasets: [
        {
            label: "",
            backgroundColor: ["#f87979", "#ff0000", "#00FF00", "#0000FF"],
            data: [1, 2, 3, 1],
        },
    ],
});
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false,
        },
    },
});

const activeIssue = ref();
const issues = ref([]);

const computedCards = computed(() => {
    //carregar da API depois
    return [
        {
            value: 0,
            tooltip: "Sem esforço significativo",
        },
        {
            value: 1,
            tooltip: "Até 1h de esforço",
        },
        {
            value: 2,
            tooltip: "Entre 1h e 2h de esforço",
        },
        {
            value: 3,
            tooltip: "Entre 1h:30m e 4h de esforço",
        },
        {
            value: 5,
            tooltip: "Entre 3h:30m e 8h de esforço",
        },
        {
            value: 8,
            tooltip: "Entre 7h e 14h de esforço",
        },
        {
            value: 13,
            tooltip: "Entre 12h e 24h de esforço",
        },
        {
            value: 21,
            tooltip: "Mais que 24h (quebrar)",
        },
        {
            value: "?",
            tooltip: "Não tenho certeza",
        },
    ];
});

const isManagement = computed(() => {
    return userStore.getUser.isManagement;
});

function addIssues(issues) {
    console.log("Issues:", issues);
    showSelectionScreen.value = false;
    socket.emit("requestAddIssues", issues);
}

function addUserStories() {
    showSelectionScreen.value = true;
}

function setSelectedCard(v) {
    voteValue.value = v;
}
function switchCharts() {
    isChart.value = !isChart.value;
}
function deselectCard() {
    voteValue.value = null;
}

function checkSessionStatus() {
    if (isConnected.value) {
        isManagement.value ? requestEndSession() : disconnectFromServer();
    } else {
        connectToServer();
    }
}

function disconnectFromServer() {
    socket.emit("disconnectRequest", {});
}

function requestEndSession() {
    if (isManagement.value) {
        socket.emit("requestEndSession");
    }
}

function onSessionEnd(reason) {
    window.alert(reason);
    navigateTo("/");
}

function chooseCard() {
    socket.emit("vote", voteValue.value);
}

function setSelectedIssue(issue) {
    if (isManagement.value) {
        socket.emit("requestSetActiveIssue", issue);
        activeIssue.value = issue;
    }
}

function setIssueDifficulty(dificulty) {
    if (isManagement.value) {
        socket.emit("setIssueDifficulty", {
            id: activeIssue.value.id,
            dificulty: dificulty,
        });
    }
}

function requestNextIssue() {
    if (isManagement.value) {
        socket.emit("requestNextIssue");
    }
}

function stopTimer() {
    statusBar.value.stopTimer();
}

function startTimer() {
    startTimerTime.value = new Date().getTime();
    statusBar.value.startTimer();
}

function resetTimer() {
    if (isManagement.value) {
        socket.emit("resetTimer");
    }
}

function clearVotes() {
    socket.emit("requestResetVotes");
}

function startSession() {
    if (isManagement.value && isConnected.value) {
        console.log("Starting session");
        socket.emit("requestCreateRoom", {
            name: "partithura", //salas únicas por enquanto
            issues: [],
        });
    }
}

function roomUpdate(room) {
    //atualização da página conforme o objeto room
    console.log("Room Update:", room);
    if (room) {
        roomName.value = room.name;
        startTimerTime.value = room.lastTimer;
        users.value = room.users;
        activeIssue.value = room.activeIssue;
        issues.value = room.issues;
        showCards.value = Boolean(room.cardsFlipped);
        endTimerTime.value = room.flippedTime;
    } else {
        onSessionEnd("Sessão terminada por um administrador.");
    }
}

function connectToServer() {
    const namespace = userStore.getUser.isManagement ? "/admins" : "/users";
    socket = io(namespace, {
        auth: {
            username: userStore.getUser.name,
            userId: userStore.getUser.id,
        },
    });
    try {
        socket.connect();
    } catch (error) {
        console.log("Erro na conexão:", error);
    } finally {
        //metodo unico para atualização do status do frontend
        socket.on("roomUpdate", roomUpdate);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("sessionEnded", onSessionEnd);

        setTimeout(() => {
            if (userStore.getUser.isManagement && !roomName.value) {
                startSession();
            }
        }, 1000);
    }
}

function requestShowCards() {
    socket.emit("requestFlipCards");
}

const isConnected = ref(false);
const transport = ref("N/A");

function onConnect() {
    isConnected.value = true;
    transport.value = socket.io.engine.transport.name;

    socket.io.engine.on("upgrade", (rawTransport) => {
        transport.value = rawTransport.name;
    });
    socket.emit("userConnection", {});
}

function onDisconnect() {
    isConnected.value = false;
    transport.value = "N/A";
}

onBeforeUnmount(() => {
    socket.emit("disconnectRequest", {});
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
});
onBeforeRouteLeave(() => {
    socket.emit("disconnectRequest", {});
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
});
</script>
<style lang="scss" scoped>
.scrollable-content {
    max-height: 300px;
    overflow-y: scroll;
}
</style>
