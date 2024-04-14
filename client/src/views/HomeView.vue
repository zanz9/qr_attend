<script setup>
import api from "@/axios/api.js";
import {RouterNames} from "@/router/routes.js";
import router from "@/router/index.js";
import Logger from "@/logger.js";
import {mdiMenu} from "@mdi/js";
import {reactive, ref} from "vue";

const logoutBtnClicked = ref(false)

async function logout() {
  logoutBtnClicked.value = true
  try {
    const {data} = await api.get('/logout')
    Logger.log(data)
    localStorage.removeItem('accessToken')
    await router.push({name: RouterNames.Login})
  } catch (e) {
    Logger.log(e)
  }
  logoutBtnClicked.value = false
}

const drawer = ref(false)
const snackbar = reactive({
  show: false,
  text: '',
  timeout: 3000,
  color: 'success'
})

function snackbarShow(text, isError = false) {
  snackbar.text = text
  snackbar.show = true
  snackbar.color = isError ? 'error' : 'primary'
}

</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon :icon="mdiMenu" @click="drawer = !drawer"/>
      <v-app-bar-title>QR Attend</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-divider class="pb-2"/>
      <v-list-item link :to="{name: RouterNames.CreateLesson}" title="Создать Урок"></v-list-item>
      <v-list-item link title="Список уроков"></v-list-item>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" @click="logout" :disabled="logoutBtnClicked">
            Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <RouterView @snackbarShow="snackbarShow"/>
      <v-snackbar
          :timeout="snackbar.timeout"
          v-model="snackbar.show"
          :color="snackbar.color"
      >
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
              color="black"
              variant="text"
              @click="snackbar.show = false"
          >
            X
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>
