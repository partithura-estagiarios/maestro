<template>
  <v-app>
    <ApplicationUserToolbar />
    <ApplicationMainView />
  </v-app>
</template>
<script setup>
import { appStore } from '#imports';
const authStore = appStore();

</script>

