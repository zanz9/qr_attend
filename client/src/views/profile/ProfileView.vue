<script setup>
import {getInfo, isAdmin, isTeacher} from "@/infoParser.js";
import {onMounted, ref} from "vue";
const loading = ref(true)
const info = ref({})

onMounted(async () => {
  info.value = await getInfo()
  loading.value = false
})

</script>

<template>
  <v-progress-circular v-if="loading"/>
  <v-container align="center" justify="center" class="pa-4" v-if="!loading">
    <v-avatar color="red" size="100" class="my-6">
      <span class="text-h3">{{ info.lastName[0] }}{{ info.firstName[0] }}</span>
    </v-avatar>

    <div>{{ info.lastName }} {{ info.firstName }}</div>

    <div v-if="isAdmin(info)">Админский аккаунт</div>
    <div v-if="isTeacher(info)">
      <div>{{info.teacher.faculty.name}}</div>
    </div>

  </v-container>

</template>
