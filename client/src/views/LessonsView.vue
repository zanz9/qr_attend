<script setup>
import {onMounted, ref} from "vue";
import api from "@/axios/api.js";
import Logger from "@/logger.js";
import {mdiArrowRight} from "@mdi/js";

const lesson = ref([])
const lessons = ref([])

onMounted(async () => {
  const {data: lessonData} = await api.get('/lesson')
  lesson.value = lessonData
  const {data: lessonsData} = await api.get('/lessons')
  lessons.value = lessonsData
})
</script>

<template>
  <h2>Текущий урок</h2>
  <v-list-item
      v-for="l in lesson"
      :key="l.uuid"
      :subtitle="l.startedAt"
      :title="l.name"
      :to="`/lesson/${l.uuid}`"
  >
    <template v-slot:append>
      <v-btn
          color="grey-lighten-1"
          :icon="mdiArrowRight"
          variant="text"
      ></v-btn>
    </template>
  </v-list-item>
  <h2>Все уроки</h2>
  <v-list-item
      v-for="(l, index) in lessons"
      :key="l.uuid"
      :subtitle="l.startedAt"
      :title="l.name">
    <v-divider v-if="index < lessons.length - 1" thickness="2"/>
  </v-list-item>
</template>
