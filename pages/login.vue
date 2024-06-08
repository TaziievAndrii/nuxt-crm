<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <div class="rounded bg-sidebar w-1/4 p-5">
      <h1 class="font-bold text-2xl mb-5 text-center">Login</h1>

      <form>
        <UiInput
            v-model="nameRef"
            placeholder="Name"
            type="text"
            class="mb-3"/>
        <UiInput
            v-model="emailRef"
            placeholder="Email"
            type="email"
            class="mb-3"/>
        <UiInput
            v-model="passwordRef"
            placeholder="Password"
            type="password"
            class="mb-3"/>

        <div class="flex items-center justify-center gap-5">
          <UiButton type="button" @click="login">Login</UiButton>
          <UiButton type="button" @click="register">Register</UiButton>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import {v4 as uuid} from 'uuid'

import {useAuthStore, useIsLoadingStore} from "~/store/auth.store";

useHead({
  title: 'Login | CRM System'
})

const nameRef = ref('')
const emailRef = ref('')
const passwordRef = ref('')

const isLoadingStore = useIsLoadingStore()
const authStore = useAuthStore()
const router = useRouter()

const login = async () => {
  isLoadingStore.set(true)
  await account.createEmailPasswordSession(emailRef.value, passwordRef.value)
  const response = await account.get()
  if (response) {
    authStore.set({
      email: response.email,
      name: response.name,
      status: response.status
    })
  }
  emailRef.value = ''
  passwordRef.value = ''
  nameRef.value = ''

  await router.push('/')
  isLoadingStore.set(false)
}

const register = async () => {
  await account.create(uuid(),emailRef.value,passwordRef.value,nameRef.value)
  await login()
}

</script>

<style scoped>

</style>