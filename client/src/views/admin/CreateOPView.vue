<script setup>
import {onMounted, reactive, ref} from "vue";
import api from "@/axios/api.js";
import {mdiMenuDown} from "@mdi/js";

const faculties = ref([])
const form = reactive({
  name: '',
  faculty: {name: 'Выберите ОП'},
})

onMounted(async () => {
  const {data} = await api.get('/faculties')
  faculties.value = data
})

async function create() {
  const {data} = await api.post('/op', {
        name: form.name,
        facultyId: form.faculty.id
      },
      {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}
      })
  console.log(data)
}
</script>

<template>
  <v-text-field
      v-model="form.name"
      label="Название ОП"
      variant="solo-filled"/>

  <v-select
      v-model="form.faculty"
      :items="faculties"
      item-title="name"
      item-value="id"
      persistent-hint
      return-object
      single-line
      variant="solo-filled"
      no-data-text="Загрузка..."
      :menu-icon="mdiMenuDown"
  />

  <v-btn @click="create">Создать</v-btn>
</template>
