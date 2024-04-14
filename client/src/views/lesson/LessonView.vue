<script setup>
import QrcodeVuefrom from 'qrcode.vue'
import api from "@/axios/api.js";
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";

const route = useRoute()

const isLoaded = ref(false)
const isLessonEnd = ref(false)
const lesson = reactive({
  name: '',
  teacher: {
    firstName: '',
    lastName: ''
  },
  startedAt: '',
  expiresIn: '',
  attends: [],
})

onMounted(async () => {
  const {data} = await api.get(`/lesson/${route.params.uuid}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  console.log(data)
  isLoaded.value = true
  if (!data) {
    isLessonEnd.value = true
  }
  lesson.name = data.name
  lesson.teacher.firstName = data.teacher.firstName
  lesson.teacher.lastName = data.teacher.lastName
  lesson.startedAt = data.startedAt
  lesson.expiresIn = data.expiresIn
  lesson.attends = data.attends
})
</script>

<template>
  <v-container>
    <v-col align="center" justify="center">
      <div v-if="!isLoaded">
        <v-progress-circular indeterminate :size="50"></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="isLessonEnd"><h1>Урок закончился!</h1></div>
        <div v-else>
          <h1>{{ lesson.name }}</h1>
          <h2> Учитель: {{ lesson.teacher.lastName }} {{ lesson.teacher.firstName }}</h2>
          <QrcodeVuefrom
              :value="`${api.getUri()}/lesson?uuid=${route.params.uuid}`"
              level="M"
              :size="300"
              render-as="svg"
              class="ma-4"
          />
          <div v-if="lesson.attends.length">
            <h3>Студенты:</h3>
            <v-list-item v-for="attend in lesson.attends">{{ attend.user.firstName }} {{ attend.user.lastName }}</v-list-item>
          </div>
        </div>
      </div>
    </v-col>
  </v-container>
</template>

<style scoped>

</style>