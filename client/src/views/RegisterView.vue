<script setup>
import {reactive, ref} from "vue";
import api from "@/axios/api.js";
import {mdiEye, mdiEyeOff} from "@mdi/js";

const rules = {
  required: value => !!value || 'Required.',
  passwordMin: value => value.length >= 8 || 'Min 8 characters',
  emailValid: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  }
}
const message = ref('')
const passwordVisible = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

async function register() {
  if (!form.firstName || !form.lastName || !form.email || !form.password) {
    return message.value = 'Заполните все обязательные поля'
  }
  try {
    const {data} = await api.post('/register', form)
    const accessToken = data.accessToken
    localStorage.setItem('accessToken', accessToken)
    message.value = data.message
  } catch (e) {
    const {status, data} = e.response
    console.log(status, data.message)
    message.value = data.message
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

    <v-card-text class="text-red" v-if="message">
      {{ message }}
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn>
        <RouterLink class="text-white text-decoration-none cursor-pointer" to="/login"> Войти</RouterLink>
      </v-btn>
      <v-spacer/>
      <v-btn color="blue" @click="register">
        Зарегистрироваться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

