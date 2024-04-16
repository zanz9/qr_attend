<script setup>

import api from "@/axios/api.js";
import {onMounted, reactive, ref, watch} from "vue";
import {mdiArrowRight, mdiMenuLeft, mdiMenuRight} from "@mdi/js";

const lessons = reactive({
  past: [],
  count: 0,
  maxPage: 0,
})
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
  data.lessons.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.past = data.lessons
  lessons.count = data.count
  lessons.maxPage = Math.floor(data.count / 10) + 1
}

</script>

<template>
  <h2>Прошедшие уроки</h2>
  <v-list-item
      v-for="l in lessons.past"
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
      :length="lessons.maxPage"
      :prev-icon="mdiMenuLeft"
      :next-icon="mdiMenuRight"
  />
</template>

