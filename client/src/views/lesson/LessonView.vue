<script setup>
import QrcodeVuefrom from 'qrcode.vue'
import api from "@/axios/api.js";
import {onMounted, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {mdiCheck, mdiClose} from "@mdi/js";
import {getInfo, isTeacher} from "@/infoParser.js";

const route = useRoute()

const showUrl = ref(false)
const url = ref(`${api.getUri()}/scan?uuid=${route.params.uuid}`)

const isLoaded = ref(false)
const isLessonEnd = ref(false)
const lesson = ref({})
const students = ref()

const info = ref({})

onMounted(async () => {
  info.value = await getInfo()

  const {data} = await api.get(`/lesson/${route.params.uuid}`, {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
    }
  })
  console.log(data)
  isLessonEnd.value = !data.current;
  lesson.value = data

  const opId = data.opId
  const course = data.course
  const {data: studentData} = await api.get('/roles/students', {
    params: {
      opId, course
    }
  })
  students.value = studentData
  console.log(studentData)
  lesson.value.attends.forEach(attend => {
    const userId = attend.userId
    console.log(userId)
    const student = students.value.find((i)=> i.id === userId)
    if (student) {
       student.isAttend = true
       student.loginTime = attend.loginTime
    }
  })
  console.log(students.value)

  students.value.sort((a, b) => {
    if (a.isAttend === b.isAttend) {
      return 0;
    } else if (a.isAttend) {
      return -1; // a идет перед b
    } else {
      return 1; // b идет перед a
    }
  });

  isLoaded.value = true
})
</script>

<template>
  <v-container>
    <v-col align="center" justify="center">
      <div v-if="!isLoaded">
        <v-progress-circular indeterminate :size="50"></v-progress-circular>
      </div>
      <div v-else>
        <div v-if="isLessonEnd"><h1>Урок закончился!</h1></div>
        <div v-else>
          <h1>{{ lesson.name }}</h1>
          <h2> Учитель: {{ lesson.teacher.lastName }} {{ lesson.teacher.firstName }}</h2>
          <h2> Кабинет: {{ lesson.cabinet }}</h2>
          <v-card color="white" max-width="320" max-height="320" v-if="isTeacher(info)">
            <QrcodeVuefrom
                class="mt-2"
                :value="`${api.getUri()}/scan?uuid=${route.params.uuid}`"
                level="M"
                :size="300"
                render-as="svg"
            />
          </v-card>
          <div v-if="isTeacher(info)" @click="showUrl = !showUrl" class="cursor-pointer mt-2"> {{ showUrl ? 'Скрыть' : 'Показать' }} ссылку</div>
          <div v-if="showUrl">{{url}}</div>
        </div>
        <h3>Стунденты {{lesson.attends.length}}/{{students.length}}</h3>
        <div v-if="students.length">
          <v-list-item v-for="student in students">
            <div>
              <span>
                {{ student.firstName }} {{ student.lastName }}
              </span>
              <v-icon :icon="mdiClose" color="red" v-if="!student.isAttend"></v-icon>
              <v-icon :icon="mdiCheck" color="green" v-if="student.isAttend"></v-icon>
              <span v-if="student.isAttend">{{ new Date(student.loginTime).toLocaleString() }}</span>
            </div>

          </v-list-item>
        </div>
      </div>
    </v-col>
  </v-container>
</template>
