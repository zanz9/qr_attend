<script setup>
import {onMounted, reactive, ref} from "vue";
import api from "@/axios/api.js";
import {mdiMenuDown} from "@mdi/js";


const name = ref('')


async function create() {
  const {data} = await api.post('/faculty', {
        name: name.value
      },
      {
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}
      })
  console.log(data)
}
</script>

<template>
  <v-text-field
      v-model="name"
      label="Название факультета"
      variant="solo-filled"/>
  <v-btn @click="create">Создать</v-btn>
</template>
