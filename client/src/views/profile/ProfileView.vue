<script setup>
import {getInfo, isAdmin, isTeacher} from "@/infoParser.js";
import {ref} from "vue";

const info = ref(getInfo())

</script>

<template>
  <v-container align="center" justify="center" class="pa-4">
    <v-avatar color="red" size="100" class="my-6">
      <span class="text-h3">{{ info.lastName[0] }}{{ info.firstName[0] }}</span>
    </v-avatar>

    <div>{{ info.lastName }} {{ info.firstName }}</div>

    <div v-if="isAdmin()">Админский аккаунт</div>
    <div v-if="isTeacher()">
      <div>{{info.teacher.faculty.name}}</div>
    </div>

  </v-container>

</template>
