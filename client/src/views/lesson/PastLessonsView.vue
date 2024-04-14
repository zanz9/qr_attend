<script setup>

import api from "@/axios/api.js";
import {onMounted, ref, watch} from "vue";
import {mdiArrowRight, mdiMenuLeft, mdiMenuRight} from "@mdi/js";

const lessons = ref([])
const page = ref(1)

onMounted(fetchLessons)
watch(page, fetchLessons)

async function fetchLessons() {
  const {data} = await api.get('/lesson/past', {
    params: {
      page: page.value,
      limit: 10
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  data.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.value = data
}

</script>

<template>
  <h2>Прошедшие уроки</h2>
  <v-list-item
      v-for="l in lessons"
      :key="l.uuid"
      :subtitle="`${l.startedAt} - ${l.expiresIn}`"
      :title="l.name"
      :to="`/lesson/${l.uuid}`">
    <template v-slot:append>
      <v-btn
          color="grey-lighten-1"
          :icon="mdiArrowRight"
          variant="text"
      ></v-btn>
    </template>
  </v-list-item>
  <v-pagination
      rounded
      v-model="page"
      :length="4"
      :prev-icon="mdiMenuLeft"
      :next-icon="mdiMenuRight"
  />
</template>

