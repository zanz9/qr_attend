<script setup>
import QrcodeVuefrom from 'qrcode.vue'
import api from "@/axios/api.js";
import {onMounted, reactive} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const lesson = reactive({
  name: '',
  teacher: {
    firstName: '',
    lastName: ''
  },
  startedAt: '',
  expiresIn: '',
})

onMounted(async () => {
  const {data} = await api.get(`/lesson/${route.params.uuid}`)
  lesson.name = data.name
  lesson.teacher.firstName = data.teacher.firstName
  lesson.teacher.lastName = data.teacher.lastName
  lesson.startedAt = data.startedAt
  lesson.expiresIn = data.expiresIn
})
</script>

<template>
  <v-container>
    <v-col align="center" justify="center">
      <h1>{{ lesson.name }}</h1>
      <h2> Учитель: {{ lesson.teacher.lastName }} {{lesson.teacher.firstName}}</h2>
      <QrcodeVuefrom
          :value="`${api.getUri()}/lesson?uuid=${route.params.uuid}`"
          level="M"
          :size="300"
          render-as="svg"
          class="ma-4"
      />
    </v-col>
  </v-container>
</template>

<style scoped>

</style>