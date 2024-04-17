<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/axios/api.js";
import {mdiArrowRight, mdiMenuLeft, mdiMenuRight} from "@mdi/js";

const role = reactive({
  isAdmin: JSON.parse(localStorage.getItem('isAdmin') )|| false,
  isTeacher: JSON.parse(localStorage.getItem('isTeacher')) || false,
  isStudent: JSON.parse(localStorage.getItem('isStudent')) || false,
})

const lessons = reactive({
  now: [],
  nowCount: 0,
  future: [],
  futureCount: 0,
  futureMaxPage: 0,
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
  now.lessons.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.now = now.lessons
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
  future.lessons.forEach(l => {
    l.startedAt = new Date(l.startedAt).toLocaleString()
    l.expiresIn = new Date(l.expiresIn).toLocaleString()
  })
  lessons.future = future.lessons
  lessons.futureCount = future.count
  lessons.futureMaxPage = Math.floor(future.count / 10) + 1
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
      :to="role.isStudent ? null : `/lesson/${l.uuid}`"
  >
    <template v-slot:append>
      <v-btn v-if="!role.isStudent"
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
      :length="lessons.futureMaxPage"
      :prev-icon="mdiMenuLeft"
      :next-icon="mdiMenuRight"
  />
</template>
