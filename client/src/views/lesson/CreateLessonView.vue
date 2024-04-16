<script setup>

import {onMounted, reactive, ref} from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import api from "@/axios/api.js";
import Logger from "@/logger.js";

const role = reactive({
  isAdmin: JSON.parse(localStorage.getItem('isAdmin')) || false,
  isTeacher: JSON.parse(localStorage.getItem('isTeacher')) || false,
  isStudent: JSON.parse(localStorage.getItem('isStudent')) || true,
})

const form = reactive({
  name: '',
  teacher: {firstName: 'Выберите', lastName: 'учителя'},
  op: {name: 'Выберите программу'},
  date: [],
  cabinet: '',
})

const teachers = ref([])
const op = ref([])

function itemProps(item) {
  return {
    title: item.firstName + ' ' + item.lastName,
  }
}

onMounted(async () => {
  const {data} = await api.get('/roles/teachers',
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      }
  )
  teachers.value = data

  const {data: opData} = await api.get('/lesson/op', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  console.log(opData)
  op.value = opData
})

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

async function create() {
  const startDate = form.date[0]
  const endDate = form.date[1]
  const {data} = await api.post('/lesson', {
        name: form.name,
        teacherId: role.isTeacher ? 0 : form.teacher.id,
        startDate,
        endDate,
        cabinet: form.cabinet,
        opId: form.op.id
      },
      {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
        }
      })
  Logger.log(data)
  snackbarShow(data.message)
}
</script>

<template>
  <h1>Добавить урок в расписание</h1>
  <v-text-field
      v-model="form.name"
      label="Название урока"
      variant="solo-filled"/>

  <v-text-field
      v-model="form.cabinet"
      label="Кабинет"
      variant="solo-filled"/>
  <v-select
      v-model="form.op"
      :items="op"
      item-title="name"
      item-value="id"
      persistent-hint
      return-object
      single-line
      variant="solo-filled"
  />

  <v-select
      v-if="role.isAdmin"
      v-model="form.teacher"
      :items="teachers"
      :item-props="itemProps"
      item-title="firstName"
      item-value="id"
      label="Выберите учителя!"
      persistent-hint
      return-object
      single-line
      variant="solo-filled"
  />
  <VueDatePicker
      dark
      :range="{partialRange:false}"
      v-model="form.date"
      month-name-format="short"
      :start-time="[{hours: 8, minutes: 0}]"
      locale="ru"
      select-text="Выбрать дату"
      cancel-text="Отмена"
  />
  <v-btn @click="create">Добавить</v-btn>


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
</template>

<style scoped>

</style>