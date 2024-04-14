<script setup>

import {onMounted, reactive, ref} from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import api from "@/axios/api.js";
import Logger from "@/logger.js";

const form = reactive({
  name: '',
  teacher: {firstName: 'Выберите', lastName: 'учителя'},
  date: [],
})

const teachers = ref([])

function itemProps(item) {
  return {
    title: item.firstName + ' ' + item.lastName,
  }
}

onMounted(async () => {
  const {data} = await api.get('/teachers')
  teachers.value = data
})
const emit = defineEmits(['snackbarShow'])
const snackbarShow = (text, isError = false) => emit('snackbarShow', text, isError)

async function create() {
  const startDate = form.date[0]
  const endDate = form.date[1]
  const {data} = await api.post('/lesson', {
    name: form.name,
    teacherId: form.teacher.id,
    startDate,
    endDate
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
  <v-select
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
</template>

<style scoped>

</style>