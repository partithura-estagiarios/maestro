<!-- eslint-disable vue/no-v-html -->
<template>
    <v-col cols="12" sm="12" md="6" lg="4" xl="3" xxl="2">
        <v-tooltip location="top center" theme="dark">
            <template #activator="activator">
                <v-card v-bind="activator.props" :color="cardColor" variant="outlined" max-height="250px" height="100%"
                    @click="viewIssue">
                    <v-toolbar :color="topBarColor" density="compact">
                        <template #prepend>
                            <v-chip class="ml-3" :color="parseColor(prop.issue?.content?.type?.color)"
                                variant="outlined" density="compact">{{
                                    prop.issue?.content?.type?.name }}</v-chip>
                        </template>
                        <v-toolbar-title class="pr-4 text-truncate">
                            <v-tooltip :text="rawIssueTitle" location="top">
                                <template #activator="{ props }">
                                    <span v-bind="props" v-html="issueTitle" />
                                </template>
                            </v-tooltip>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="card-description text-white">
                        <div class="px-3" v-html="mdBody" />
                    </v-card-text>
                    <v-card-actions class="px-0 pb-0 mx-0">
                        <v-toolbar :color="bottomBarColor" density="compact" class="px-2 py-0">
                            <v-chip v-for="label in prop.issue.content.labels" :key="label.id" class="mx-1"
                                density="compact" :color="parseColor(label.color)" variant="outlined">{{ label.name
                                }}</v-chip>
                            <v-spacer />
                            <a class="issue-number" :class="issueLinkColor" @click.stop="handleClick" :href="issueLink"
                                target="_blank">
                                {{ prop.issue?.content?.repository?.name }}/<span>#{{ prop.issue?.content?.number
                                    }}</span>
                            </a>
                        </v-toolbar>
                    </v-card-actions>
                </v-card>
            </template>
            <h2>{{ tooltipText }}</h2>
        </v-tooltip>
    </v-col>
</template>
<script setup>
const appStore = useAppStore()
const config = useRuntimeConfig();

const { organizationName } = config.public;
const emits = defineEmits(['click'])
const prop = defineProps({
    issue: {
        type: Object,
        default: () => { }
    },
    isSelected: {
        type: Boolean,
        default: false
    }
})
const issueLink = computed(() => {
    return `https://github.com/${organizationName}/${prop.issue?.content?.repository?.name}/issues/${prop.issue?.content?.number}`
})
const mdBody = computed(() => {

    return parseGitMD(prop.issue?.content?.body, prop.issue?.content?.repository?.name)
})

function handleClick(e) {
    e
}

const issueLinkColor = computed(() => {
    const name = prop.issue?.content?.repository?.name
    if (name.includes('frontend')) {
        return 'frontend-text'
    }
    if (name.includes('backend')) {
        return 'backend-text'
    }
    return 'unknown-text'
})

const tooltipText = computed(() => {
    return votedValue.value?.vote != null ? `Você votou ${votedValue.value.vote} nessa task.` : 'Task sem seu voto.'
})

const votedValue = computed(() => {
    return prop.issue?.votes?.find(vote => {
        return vote.user?.id == appStore.getCurrentUserInfo.id
    })
})

const cardColor = computed(() => {
    if (!prop.isSelected) {
        return prop.issue.votes.findIndex(vote => {
            return vote.user.id == appStore.getCurrentUserInfo.id
        }) >= 0 ? 'green-darken-4' : 'grey-darken-2'
    }
    return prop.isSelected ? 'blue-grey-darken-2' : 'grey-darken-4'
})
const topBarColor = computed(() => {
    if (!prop.isSelected) {
        return prop.issue.votes.findIndex(vote => {
            return vote.user.id == appStore.getCurrentUserInfo.id
        }) >= 0 ? 'green-darken-4' : 'grey-darken-4'
    }
    return prop.isSelected ? 'blue-grey-darken-2' : 'grey-darken-4'
})
const bottomBarColor = computed(() => {
    if (!prop.isSelected) {
        return prop.issue.votes.findIndex(vote => {
            return vote.user.id == appStore.getCurrentUserInfo.id
        }) >= 0 ? 'grey-darken-4' : 'grey-darken-4'
    }
    return prop.isSelected ? 'blue-grey-darken-4' : 'grey-darken-4'
})

const issueTitle = computed(() => {

    return parseGitMD(prop.issue?.fields[0]?.value?.html, prop.issue?.content?.repository?.name)
})
const rawIssueTitle = computed(() => {
    return prop.issue?.fields[0]?.value?.raw
})

function viewIssue() {
    emits("click", prop.issue)
}


</script>
<style lang="scss" scoped>
.issue-number {
    font-weight: 800;
    font-size: 0.875rem;
    text-decoration: none;

    span {
        color: rgb(128, 128, 128);
    }
}

.card-description {
    height: 94px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
}

.selected {
    color: white;
}
</style>