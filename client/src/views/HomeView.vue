<script setup>
import api from "@/axios/api.js";
import {RouterNames} from "@/router/routes.js";
import router from "@/router/index.js";
import Logger from "@/logger.js";

async function logout() {
  const {data} = await api.get('/logout')
  Logger.log(data)
  localStorage.removeItem('accessToken')
  await router.push({name: RouterNames.Login})
}
</script>

<template>
  <main>
    HOME
    <v-btn @click="logout">
      LOGOUT
    </v-btn>
  </main>
</template>
