<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">
      Edit {{ (data as unknown as ICustomerFormState)?.name }}
    </h1>
    <form @submit="onSubmit" class="form">
      <UiInput
          placeholder="Name"
          v-model="name"
          v-bind="nameAttrs"
          type="text"
          class="input"
      />

      <UiInput
          placeholder="Customer email"
          v-model="email"
          v-bind="emailAttrs"
          type="email"
          class="input"
      />
      <UiInput
          placeholder="From"
          v-model="fromSource"
          v-bind="fromSourceAttrs"
          type="text"
          class="input"
      />

      <img
          v-if="values.avatar_url || isUploadImagePending"
          :src="values.avatar_url"
          alt=""
          width="50"
          height="50"
          class="rounded-full my-4 w-[100px] h-[100px] object-cover"
      >

      <div class="grid w-full max-w-sm items-center gap-1.5 input">
        <label>
          <div class="text-sm mb-2">Logo</div>
          <UiInput
             :onchange="(e:InputFileEvent) => e?.target?.files?.length && uploadImage(e?.target?.files[0])"
              type="file"
              class="input"
             :disabled="isUploadImagePending"
          />
        </label>
      </div>


      <UiButton class="btn mt-3" variant="secondary" :disabled="isPending">
        {{ isPending ? 'Loading...' : 'Save' }}
      </UiButton>
    </form>

  </div>
</template>

<script setup lang="ts">
import {storage} from '@/utils/appwrite'
import {COLLECTION_CUSTOMERS, DB_ID, STORAGE_ID} from "~/app.constants";
import type {ICustomer} from "~/types/deals.types";

import {useMutation, useQuery} from "@tanstack/vue-query";
import {v4 as uuid} from 'uuid'
import {useRoute} from "vue-router";

interface InputFileEvent extends Event {
  target: HTMLInputElement
}

interface ICustomerFormState extends Pick<ICustomer, 'avatar_url' | 'email' | 'name' | 'from_source'> {
}

useSeoMeta({
  title: 'Company editing'
})

const route = useRoute()
const customerId = route.params.id as string

const {handleSubmit, defineField, setFieldValue, setValues, values} = useForm<ICustomerFormState>()

const {data, isSuccess} = useQuery({
  queryKey: ['get customer', customerId],
  queryFn: () => DB.getDocument(DB_ID, COLLECTION_CUSTOMERS, customerId)
})

watch(isSuccess, () => {
  const initialData = data.value as unknown as ICustomerFormState
  setValues({
    email: initialData.email,
    avatar_url: initialData.avatar_url,
    from_source: initialData.from_source || '',
    name: initialData.name
  })
})


const [name, nameAttrs] = defineField('name')
const [email, emailAttrs] = defineField('email')
const [fromSource, fromSourceAttrs] = defineField('from_source')

const {mutate, isPending} = useMutation({
  mutationKey: ['update customer', customerId],
  mutationFn: (data: ICustomerFormState) => DB.updateDocument(DB_ID, COLLECTION_CUSTOMERS, customerId, data)
})

const {mutate: uploadImage, isPending: isUploadImagePending} = useMutation({
  mutationKey: ['upload image'],
  mutationFn: (file: File) => storage.createFile(STORAGE_ID, uuid(), file),
  onSuccess(data) {
    const response = storage.getFileDownload(STORAGE_ID, data.$id)
    setFieldValue('avatar_url', response.href)
  },
})

const onSubmit = handleSubmit(values => {
  mutate(values)
})
</script>

<style scoped>
.input {
  @apply border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors;
}
</style>