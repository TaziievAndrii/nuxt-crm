<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">CRM System</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="grid grid-cols-5 gap-16">
        <div
            v-for="(column,index) in data"
            :key="column.id"
            @dragover="handleDragOver"
            @drop="() =>handleDrop(column)"
            class="min-h-screen"
        >
          <div class="rounded bg-slate-700 py-1 px-5 mb-2 text-center" :style="generateColumnStyle(index,data?.length)">
            {{ column.name }}
          </div>
          <div>
            <KanbanCreateDeal :refetch="refetch" :status="column.id"/>
            <UiCard class="mb-5" draggable="true" v-for="card in column.items" :key="card.id"
                    @dragstart="() => handleDragStart(card,column)">
              <UiCardHeader role="button" @click="store.set(card)">
                <UiCardTitle>
                  {{ card.name }}
                </UiCardTitle>
                <UiCardDescription class="mt-2 block">
                  {{ convertCurrency(card.price) }}
                </UiCardDescription>
              </UiCardHeader>
              <UiCardContent class="text-xs">{{ card.companyName }}</UiCardContent>
              <UiCardFooter>{{ dayjs(card.$createdAt).format('DD MMMM YYYY') }}</UiCardFooter>
            </UiCard>
          </div>
        </div>
      </div>
      <KanbanSlideoverSlideOver/>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {ICard, IColumn} from "~/components/kanban/kanban.types";
import {useKanbanQuery} from "~/components/kanban/useKanbanQuery";
import {generateColumnStyle} from "~/components/kanban/generate-gradient";

import {convertCurrency} from '@/utils/convertCurrency'
import type {EnumStatus} from "~/types/deals.types";

import {COLLECTION_DEALS, DB_ID} from "~/app.constants";

import {useDealSlideStore} from "~/store/deal-slide.store";

import dayjs from "dayjs";
import {useMutation} from "@tanstack/vue-query";

useSeoMeta({
  title: 'Home | CRM System'
})

const dragCardRef = ref<ICard | null>(null)
const sourceColumnRef = ref<IColumn | null>(null)

const {data, isLoading, refetch} = useKanbanQuery()
const store = useDealSlideStore()

type TypeMutationVariables = {
  docId: string,
  status?: EnumStatus
}

const {mutate} = useMutation({
  mutationKey: ['move card'],
  mutationFn: ({ docId, status }: TypeMutationVariables) =>
      DB.updateDocument(DB_ID, COLLECTION_DEALS, docId, {
        status,
      }),
  onSuccess: () => {
    refetch()
  },
})

function handleDragStart(card: ICard, column: IColumn) {
  dragCardRef.value = card
  sourceColumnRef.value = column
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
}

function handleDrop(targetColumn: IColumn) {
  if (dragCardRef.value && sourceColumnRef.value) {
    mutate({ docId: dragCardRef.value.id, status: targetColumn.id })
  }
}


</script>

<style scoped>

</style>