<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import api from "@/axios/api.js";
import {mdiEye, mdiEyeOff} from "@mdi/js";
import router from "@/router/index.js";
import {RouterNames} from "@/router/routes.js";
import Logger from "@/logger.js";

const rules = {
  required: value => !!value || 'Заполните поле.',
  passwordMin: value => value.length >= 8 || 'Минимум 8 символов',
  emailValid: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Неправльный формат почты.'
  }
}
const message = reactive({
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
const ops = ref([])
const op = ref({name: 'Выберите программу'})

onMounted(async () => {
  const {data} = await api.get('/faculties')
  faculties.value = data
})

watch(faculty, async () => {
  const {data} = await api.get('/op', {
    params: {
      facultyId: faculty.id
    }
  })
  ops.value = data
})

async function register() {
  console.log(form)
  if (!form.firstName || !form.lastName || !form.email || !form.password) {
    message.text = 'Заполните все обязательные поля'
    message.isError = true
    return
  }
  try {
    disableButton.value = true
    const {data} = await api.post('/register', {
      ...form,
      opId: op.value.id,
    })
    const accessToken = data.accessToken
    localStorage.setItem('accessToken', accessToken)
    message.text = data.message
    message.isError = false
    await router.push({name: RouterNames.Home})
  } catch (e) {
    const {status, data} = e.response
    Logger.log(status, data)
    message.value = data.message
    message.isError = true
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
    <v-card-title class="text-center text-h4">Регистрация</v-card-title>
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
      />
      <v-select
          v-model="op"
          :items="ops"
          item-title="name"
          item-value="id"
          persistent-hint
          return-object
          single-line
          variant="solo-filled"
          no-data-text="Сначала выберите факультет"
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

    <v-card-text :class="message.isError ? 'text-red' : 'text-green'" v-if="message.text">
      {{ message.text }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="()=>{router.push({name: RouterNames.Login})}">
        Войти
      </v-btn>
      <v-spacer/>
      <v-btn color="blue" @click="register" :disabled="disableButton">
        Зарегистрироваться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

