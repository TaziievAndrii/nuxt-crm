<template>
  <UiInput
      placeholder="Leave a comment"
      v-model="commentRef"
      @keyup.enter="writeComment"
  />

  <UiSkeleton v-if="isLoading" class="w-full h-[76px] rounded mt-5"/>
  <div v-else-if="card">
    <div
        v-for="comment in card?.comments"
        :key="comment.$id"
        class="flex items-start mt-5"
    >
      <Icon name="radix-icons:chat-bubble" class="mr-3 mt-1" size="25"/>
      <div class="border-border bg-black/20 rounded p-3 w-full">
        <div class="mb-3 text-sm">
          Comment {{dayjs(comment.$createdAt).format('HH:mm')}}
        </div>
        <p>{{comment.text}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";

import type {IDeal} from '~/types/deals.types'
import {useDealSlideStore} from "~/store/deal-slide.store";

import {useComments} from "~/components/kanban/slideover/useComments";
import {useCreateComment} from "~/components/kanban/slideover/useCreateComment";

const {data, refetch, isLoading} = useComments()
const {commentRef, writeComment} = useCreateComment({refetch})

const store = useDealSlideStore()
const card = data as unknown as IDeal
</script>

<style scoped>

</style>