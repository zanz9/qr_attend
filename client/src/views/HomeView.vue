<script setup>
import api from "@/axios/api.js";
import {RouterNames} from "@/router/routes.js";
import router from "@/router/index.js";
import Logger from "@/logger.js";
import {mdiMenu} from "@mdi/js";
import {onMounted, ref} from "vue";
import {getInfo, isAdmin, isTeacher, rmInfo} from "@/infoParser.js";

const loading = ref(true)

const logoutBtnClicked = ref(false)
const info = ref()

onMounted(async () => {
  info.value = await getInfo()
  loading.value = false
})

async function logout() {
  logoutBtnClicked.value = true
  try {
    await api.get('/logout')
    localStorage.removeItem('accessToken')
    rmInfo()
    await router.push({name: RouterNames.Login})
  } catch (e) {
  }
  logoutBtnClicked.value = false
}

const drawer = ref(false)

</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon :icon="mdiMenu" @click="drawer = !drawer"/>
      <v-app-bar-title>QR Attend</v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" temporary v-if="!loading">
      <v-list-item nav class="py-4 px-4" :to="{name: RouterNames.Profile}">
        <v-avatar color="red" size="32" class="mr-2">
          <span>{{ info.lastName[0] }}{{ info.firstName[0] }}</span>
        </v-avatar>
        <span> {{ info.lastName }} {{ info.firstName }}</span>
      </v-list-item>
      <v-divider class="pb-2"/>

      <v-list-item v-if="isTeacher(info) || isAdmin(info)" link :to="{name: RouterNames.CreateLesson}"
                   title="Создать Урок"></v-list-item>
      <v-list-item link :to="{name: RouterNames.Lessons}" title="Список уроков"></v-list-item>
      <v-list-item link :to="{name: RouterNames.PastLesson}" title="Прошлые уроки"></v-list-item>

      <div v-if="isAdmin(info)">
        <v-list-item link :to="{name: RouterNames.CreateFaculty}" title="Добавить факультет"></v-list-item>
        <v-list-item link :to="{name: RouterNames.CreateOP}" title="Добавить ОП"></v-list-item>
        <v-list-item link :to="{name: RouterNames.CreateTeacher}" title="Создать аккаунт учителя"></v-list-item>
      </div>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" @click="logout" :disabled="logoutBtnClicked">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <RouterView/>
    </v-main>
  </v-app>
</template>
