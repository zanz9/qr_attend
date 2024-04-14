<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/axios/api.js";
import {mdiArrowRight, mdiMenuLeft, mdiMenuRight} from "@mdi/js";
import Logger from "@/logger.js";

const lessons = reactive({
  now: [],
  future: [],
})
const page = ref(1)

onMounted(async () => {
  await fetchNow()
  await fetchFuture()
})

async function fetchNow() {
  const {data: now} = await api.get('/lesson/now', {
    params: {
      page,
      limit: 10
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  now.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.now = now
}

async function fetchFuture() {
  const {data: future} = await api.get('/lesson/future', {
    params: {
      page: page.value,
      limit: 10
    },
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  future.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.future = future
}

watch(page, fetchFuture)
</script>

<template>
  <h2>Текущий урок</h2>
  <v-list-item
      v-for="l in lessons.now"
      :key="l.uuid"
      :subtitle="`${l.startedAt} - ${l.expiresIn}`"
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

  <h2>Будущие уроки</h2>
  <v-list-item
      v-for="(l, index) in lessons.future"
      :key="l.uuid"
      :subtitle="`${l.startedAt} - ${l.expiresIn}`"
      :title="l.name">
    <v-divider v-if="index < lessons.future.length - 1" thickness="2"/>
  </v-list-item>
  <v-pagination
      rounded
      v-model="page"
      :length="4"
      :prev-icon="mdiMenuLeft"
      :next-icon="mdiMenuRight"
  />
</template>
