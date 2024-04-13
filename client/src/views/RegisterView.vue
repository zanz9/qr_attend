<script setup>

import {reactive, ref} from "vue";

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
})

</script>

<template>
  <v-card
      class="mx-auto pa-2"
      max-width="344"
      title="Регистрация"
  >
    <v-container>
      <v-text-field
          v-model="form.firstName"
          color="primary"
          label="Имя"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="form.lastName"
          color="primary"
          label="Фамилия"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="form.email"
          color="primary"
          label="Email"
          variant="underlined"
      ></v-text-field>

      <v-text-field
          v-model="form.password"
          color="primary"
          label="Password"
          placeholder="Enter your password"
          variant="underlined"
      ></v-text-field>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn>
        <RouterLink class="text-white text-decoration-none cursor-pointer" to="/login"> Войти</RouterLink>
      </v-btn>
      <v-spacer/>
      <v-btn color="blue">
        Зарегистрироваться
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

