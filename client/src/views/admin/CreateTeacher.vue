<script setup>
import {nextTick, onMounted, reactive, ref} from "vue";
import api from "@/axios/api.js";
import {mdiEye, mdiEyeOff, mdiMenuDown} from "@mdi/js";
import Logger from "@/logger.js";

const rules = {
  required: value => !!value || 'Заполните поле.',
  passwordMin: value => value.length >= 8 || 'Минимум 8 символов',
  emailValid: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Неправльный формат почты.'
  }
}
const message = ref({
  show: false,
  text: '',
  isError: false
})

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})
const passwordVisible = ref(false)
const disableButton = ref(false)
const faculty = ref({name: 'Выберите факультет'})
const faculties = ref([])

onMounted(async () => {
  const {data} = await api.get('/faculties')
  faculties.value = data
})


async function register() {
  console.log(form)
  if (!form.firstName || !form.lastName || !form.email || !form.password || !faculty.value.id) {
    message.value.text = 'Заполните все обязательные поля'
    message.value.isError = true
    message.value.show = true
    return
  }
  try {
    disableButton.value = true
    const {data} = await api.post('/roles/teacher', {
          ...form,
          facultyId: faculty.value.id
        },
        {
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}
        })
    message.value.text = data.message
    message.value.isError = false
    message.value.show = true
  } catch (e) {
    const {status, data} = e.response
    Logger.log(status, data)
    message.value.text = data.message
    message.value.isError = true
    message.value.show = true
  } finally {
    disableButton.value = false
  }
}
</script>

<template>
  <v-card
      variant="tonal"
      class="mx-auto pa-3 py-6"
      max-width="344"
  >
    <v-card-title class="text-center text-h4">Аккаунт</v-card-title>
    <v-container>
      <v-text-field
          v-model="form.firstName"
          color="primary"
          label="Имя"
          variant="underlined"
          :rules="[rules.required]"
      ></v-text-field>

      <v-text-field
          v-model="form.lastName"
          color="primary"
          label="Фамилия"
          variant="underlined"
          :rules="[rules.required]"
      ></v-text-field>

      <v-select
          v-model="faculty"
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

      <v-text-field
          v-model="form.email"
          color="primary"
          label="Email"
          :rules="[rules.required, rules.emailValid]"
          variant="underlined"
          hint="example@example.com"
      ></v-text-field>

      <v-text-field
          v-model="form.password"
          variant="underlined"
          color="primary"
          :append-icon="passwordVisible ? mdiEye : mdiEyeOff"
          :rules="[rules.required, rules.passwordMin]"
          :type="passwordVisible ? 'text' : 'password'"
          hint="Миниммум 8 символов"
          label="Пароль"
          counter
          @click:append="passwordVisible = !passwordVisible"
      ></v-text-field>
    </v-container>

    <v-card-text :class="message.isError ? 'text-red' : 'text-green'" v-if="message.show">
      {{ message.text }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer/>
      <v-btn color="blue" @click="register" :disabled="disableButton">
        Создать
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

