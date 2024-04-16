<script setup>
import api from "@/axios/api.js";
import {RouterNames} from "@/router/routes.js";
import router from "@/router/index.js";
import Logger from "@/logger.js";
import {mdiMenu} from "@mdi/js";
import {nextTick, onMounted, reactive, ref} from "vue";

const logoutBtnClicked = ref(false)

const role = reactive({
  isAdmin: JSON.parse(localStorage.getItem('isAdmin') )|| false,
  isTeacher: JSON.parse(localStorage.getItem('isTeacher')) || false,
  isStudent: JSON.parse(localStorage.getItem('isStudent')) || true,
})

onMounted(async () => {
  const {data} = await api.get('/me', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  localStorage.setItem('isAdmin', data.isAdmin)
  localStorage.setItem('isTeacher', data.teacher != null)
  localStorage.setItem('isStudent', data.student != null)
  await nextTick()
})

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

</script>

<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon :icon="mdiMenu" @click="drawer = !drawer"/>
      <v-app-bar-title>QR Attend</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-divider class="pb-2"/>

      <v-list-item v-if="role.isTeacher || role.isAdmin" link :to="{name: RouterNames.CreateLesson}"
                   title="Создать Урок"></v-list-item>
      <v-list-item link :to="{name: RouterNames.Lessons}" title="Список уроков"></v-list-item>
      <v-list-item link :to="{name: RouterNames.PastLesson}" title="Прошлые уроки"></v-list-item>

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
