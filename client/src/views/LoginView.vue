<script setup>
import {reactive, ref} from "vue";
import {mdiEye, mdiEyeOff} from "@mdi/js";
import api from "@/axios/api.js";
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
  email: '',
  password: ''
})
const passwordVisible = ref(false)
const disableButton = ref(false)

async function login() {
  if (!form.email || !form.password) {
    message.text = 'Заполните все обязательные поля'
    message.isError = true
    return
  }
  try {
    disableButton.value = true
    const {data} = await api.post('/login', form)
    const accessToken = data.accessToken
    localStorage.setItem('accessToken', accessToken)
    message.text = data.message
    message.isError = false
    await router.push({name: RouterNames.Home})
  } catch (e) {
    const {status, data} = e.response
    Logger.log(status, message)
    message.text = data.message
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
    <v-card-title class="text-center">Вход</v-card-title>
    <v-container>
      <v-text-field
          v-model="form.email"
          color="primary"
          label="Email"
          variant="underlined"
          :rules="[rules.required, rules.emailValid]"
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
      <v-btn @click="()=>{router.push({name: RouterNames.Register})}">
        Зарегистрироваться
      </v-btn>
      <v-spacer/>
      <v-btn color="primary" @click="login" :disabled="disableButton">
        Войти
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

